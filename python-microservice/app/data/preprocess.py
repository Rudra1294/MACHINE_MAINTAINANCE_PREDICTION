import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from imblearn.over_sampling import SMOTE
import joblib
import os


# ============================================================
# FILE PATHS
# ============================================================

DATA_DIR = os.path.dirname(os.path.abspath(__file__))

SCALER_PATH = os.path.join(DATA_DIR, "scaler.joblib")
PCA_PATH = os.path.join(DATA_DIR, "pca.joblib")


# ============================================================
# LOAD AND CLEAN DATA
# ============================================================

def load_and_clean_data(file_path):

    print("Loading AI4I 2020 Predictive Maintenance Dataset...")

    df = pd.read_csv(file_path)

    # Remove identifiers
    df = df.drop(
        ["UDI", "Product ID"],
        axis=1
    )

    # Encode Type using LabelEncoder
    le = LabelEncoder()

    df["Type"] = le.fit_transform(df["Type"])

    print(
        "Type encoding:",
        dict(zip(le.classes_, le.transform(le.classes_)))
    )

    # Features
    X = df.drop(
        [
            "Machine failure",
            "TWF",
            "HDF",
            "PWF",
            "OSF",
            "RNF"
        ],
        axis=1
    )

    # Target
    y = df["Machine failure"].values

    return X, y


# ============================================================
# FIT SCALER + PCA
# ============================================================

def fit_and_save_transformers(X, n_components=4):

    print("Scaling features and fitting PCA...")

    scaler = StandardScaler()

    X_scaled = scaler.fit_transform(X)

    pca = PCA(
        n_components=n_components
    )

    X_pca = pca.fit_transform(X_scaled)

    # Save scaler
    joblib.dump(
        scaler,
        SCALER_PATH
    )

    # Save PCA
    joblib.dump(
        pca,
        PCA_PATH
    )

    print(
        f"Saved scaler artifact to: {SCALER_PATH}"
    )

    print(
        f"Saved PCA transformer artifact to: {PCA_PATH}"
    )

    explained_variance = (
        np.sum(
            pca.explained_variance_ratio_
        ) * 100
    )

    print(
        f"PCA preserved {explained_variance:.2f}% "
        f"of original variance using "
        f"{n_components} components."
    )

    return X_pca


# ============================================================
# TRAINING PREPROCESSING
# ============================================================

def prepare_quantum_data(
    file_path,
    test_size=0.2,
    random_state=42
):

    X, y = load_and_clean_data(
        file_path
    )

    X_processed = fit_and_save_transformers(
        X,
        n_components=4
    )

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_processed,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y
    )

    # SMOTE only on training data
    print(
        "Applying SMOTE to balance healthy vs. failure classes..."
    )

    smote = SMOTE(
        random_state=random_state
    )

    X_train_resampled, y_train_resampled = (
        smote.fit_resample(
            X_train,
            y_train
        )
    )

    print(
        f"Original training distribution: "
        f"Healthy={np.sum(y_train == 0)}, "
        f"Failure={np.sum(y_train == 1)}"
    )

    print(
        f"Balanced training distribution: "
        f"Healthy={np.sum(y_train_resampled == 0)}, "
        f"Failure={np.sum(y_train_resampled == 1)}"
    )

    return (
        X_train_resampled,
        X_test,
        y_train_resampled,
        y_test
    )


# ============================================================
# LIVE INFERENCE PREPROCESSING
# ============================================================

def transform_raw_data_for_inference(raw_df):

    # --------------------------------------------------------
    # Check saved preprocessing artifacts
    # --------------------------------------------------------

    if not os.path.exists(SCALER_PATH):

        raise FileNotFoundError(
            f"Scaler model missing: {SCALER_PATH}"
        )

    if not os.path.exists(PCA_PATH):

        raise FileNotFoundError(
            f"PCA model missing: {PCA_PATH}"
        )

    # --------------------------------------------------------
    # Load artifacts
    # --------------------------------------------------------

    scaler = joblib.load(
        SCALER_PATH
    )

    pca = joblib.load(
        PCA_PATH
    )

    # Work on a copy
    df = raw_df.copy()

    print(
        "Raw inference columns:",
        df.columns.tolist()
    )

    print(
        "Raw Type values:",
        df["Type"].tolist()
        if "Type" in df.columns
        else "Type column missing"
    )

    # --------------------------------------------------------
    # Convert Type to the SAME encoding used by LabelEncoder
    #
    # LabelEncoder alphabetical order:
    #
    # H = 0
    # L = 1
    # M = 2
    # --------------------------------------------------------

    if "Type" in df.columns:

        type_mapping = {
            "H": 0,
            "L": 1,
            "M": 2
        }

        # Convert everything to string first
        df["Type"] = (
            df["Type"]
            .astype(str)
            .str.strip()
            .str.upper()
            .map(type_mapping)
        )

        # Check for invalid values
        if df["Type"].isna().any():

            raise ValueError(
                "Invalid machine Type received. "
                "Expected H, L or M."
            )

    # --------------------------------------------------------
    # Remove identifiers / target columns
    # --------------------------------------------------------

    cols_to_drop = [
        "UDI",
        "Product ID",
        "Machine failure",
        "TWF",
        "HDF",
        "PWF",
        "OSF",
        "RNF",
        "machine_id"
    ]

    df_cleaned = df.drop(
        columns=[
            c for c in cols_to_drop
            if c in df.columns
        ]
    )

    # --------------------------------------------------------
    # Ensure feature order is exactly the same as training
    # --------------------------------------------------------

    if hasattr(
        scaler,
        "feature_names_in_"
    ):

        expected_columns = list(
            scaler.feature_names_in_
        )

        missing_columns = [
            c for c in expected_columns
            if c not in df_cleaned.columns
        ]

        if missing_columns:

            raise ValueError(
                "Missing required features: "
                + str(missing_columns)
            )

        df_cleaned = df_cleaned[
            expected_columns
        ]

    # --------------------------------------------------------
    # Make absolutely sure all values are numeric
    # --------------------------------------------------------

    for column in df_cleaned.columns:

        df_cleaned[column] = pd.to_numeric(
            df_cleaned[column],
            errors="raise"
        )

    print(
        "Processed inference columns:",
        df_cleaned.columns.tolist()
    )

    print(
        "Processed inference data:\n",
        df_cleaned
    )

    # --------------------------------------------------------
    # Scaling
    # --------------------------------------------------------

    X_scaled = scaler.transform(
        df_cleaned
    )

    # --------------------------------------------------------
    # PCA
    # --------------------------------------------------------

    X_pca = pca.transform(
        X_scaled
    )

    print(
        "PCA inference shape:",
        X_pca.shape
    )

    return X_pca


# ============================================================
# DIRECT TRAINING TEST
# ============================================================

if __name__ == "__main__":

    current_dir = os.path.dirname(
        os.path.abspath(__file__)
    )

    dataset_path = os.path.join(
        current_dir,
        "ai4i2020.csv"
    )

    if os.path.exists(dataset_path):

        prepare_quantum_data(
            dataset_path
        )

    else:

        print(
            "Error: Could not find dataset at:"
        )

        print(
            dataset_path
        )