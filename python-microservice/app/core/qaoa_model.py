import warnings

from qiskit_algorithms import QAOA
from qiskit_algorithms.optimizers import COBYLA
from qiskit.primitives import StatevectorSampler
from qiskit_optimization import QuadraticProgram
from qiskit_optimization.algorithms import MinimumEigenOptimizer


warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", module="scipy.sparse")


def run_qaoa_scheduler(failed_machine_ids, max_technicians=2):
    """
    QAOA-based maintenance scheduling.

    Schedules at most max_technicians machines for today.

    To keep local Statevector QAOA practical, only a small candidate
    set is sent to the quantum optimizer when many machines fail.
    """

    # Remove duplicate machine IDs while preserving order
    failed_machine_ids = list(dict.fromkeys(failed_machine_ids))

    num_machines = len(failed_machine_ids)

    # Nothing to schedule
    if num_machines == 0:
        return []

    # No technicians available
    if max_technicians <= 0:
        return [
            {
                "machine_id": int(mid),
                "action": "DELAY_REPAIR"
            }
            for mid in failed_machine_ids
        ]

    # If number of failures is within technician capacity,
    # schedule all directly.
    if num_machines <= max_technicians:
        return [
            {
                "machine_id": int(mid),
                "action": "SCHEDULE_TODAY"
            }
            for mid in failed_machine_ids
        ]

    # ---------------------------------------------------------
    # LIMIT QAOA PROBLEM SIZE
    # ---------------------------------------------------------
    #
    # Statevector simulation becomes expensive as the number
    # of qubits increases.
    #
    # We therefore send only a small candidate group to QAOA.
    # The remaining machines are marked for delayed repair.
    #
    MAX_QAOA_CANDIDATES = 8

    candidate_count = min(
        num_machines,
        max(max_technicians * 2, MAX_QAOA_CANDIDATES)
    )

    candidate_machines = failed_machine_ids[:candidate_count]

    num_candidates = len(candidate_machines)

    print(
        f"QAOA scheduling {num_candidates} candidates "
        f"from {num_machines} failed machines "
        f"for {max_technicians} technicians..."
    )

    # ---------------------------------------------------------
    # QUADRATIC PROGRAM
    # ---------------------------------------------------------

    qp = QuadraticProgram(
        name="Maintenance_Scheduling"
    )

    # Binary variable:
    # x_i = 1 -> schedule machine today
    # x_i = 0 -> delay machine
    for i in range(num_candidates):
        qp.binary_var(
            name=f"x_{i}"
        )

    # Maximize number of scheduled machines.
    #
    # Qiskit minimizes by default, therefore negative values.
    linear_objective = {
        f"x_{i}": -1.0
        for i in range(num_candidates)
    }

    qp.minimize(
        linear=linear_objective
    )

    # Technician capacity constraint
    constraint_linear = {
        f"x_{i}": 1.0
        for i in range(num_candidates)
    }

    qp.linear_constraint(
        linear=constraint_linear,
        sense="<=",
        rhs=max_technicians,
        name="technician_capacity"
    )

    # ---------------------------------------------------------
    # QAOA
    # ---------------------------------------------------------

    sampler = StatevectorSampler()

    optimizer = COBYLA(
        maxiter=30
    )

    qaoa = QAOA(
        sampler=sampler,
        optimizer=optimizer,
        reps=1
    )

    optimizer_wrapper = MinimumEigenOptimizer(
        qaoa
    )

    # Solve
    result = optimizer_wrapper.solve(qp)

    optimal_decisions = result.x

    # ---------------------------------------------------------
    # BUILD RESULT
    # ---------------------------------------------------------

    schedule_results = []

    scheduled_count = 0

    for idx, decision in enumerate(optimal_decisions):

        machine_id = candidate_machines[idx]

        if (
            float(decision) >= 0.5
            and scheduled_count < max_technicians
        ):
            action = "SCHEDULE_TODAY"
            scheduled_count += 1
        else:
            action = "DELAY_REPAIR"

        schedule_results.append({
            "machine_id": int(machine_id),
            "action": action
        })

    # Machines not included in QAOA candidates
    # are automatically delayed.
    for machine_id in failed_machine_ids[candidate_count:]:

        schedule_results.append({
            "machine_id": int(machine_id),
            "action": "DELAY_REPAIR"
        })

    print(
        f"QAOA completed. "
        f"Scheduled today: {scheduled_count}"
    )

    return schedule_results


if __name__ == "__main__":

    mock_failed_machines = [
        104,
        209,
        511
    ]

    schedule = run_qaoa_scheduler(
        mock_failed_machines,
        max_technicians=2
    )

    print(
        "\n--- QAOA Optimal Maintenance Schedule Output ---"
    )

    for item in schedule:

        print(
            f"Machine ID {item['machine_id']}: "
            f"{item['action']}"
        )