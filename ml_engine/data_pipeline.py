import pandas as pd
import numpy as np

def profile_dataset(df: pd.DataFrame) -> dict:
    """Generates column distributions, missingness patterns, and data quality score."""
    total_cells = np.prod(df.shape)
    missing_cells = df.isnull().sum().sum()
    missing_pct = (missing_cells / total_cells) * 100
    
    # Check logical constraint breaks
    breaks = 0
    if 'current_balance' in df.columns and 'original_balance' in df.columns:
        breaks += (df['current_balance'] > df['original_balance'] * 1.05).sum()
    if 'days_past_due' in df.columns:
        breaks += (df['days_past_due'] < 0).sum()
        
    dq_score = max(0.0, round(100.0 - (missing_pct * 1.5) - (breaks / len(df) * 50), 2))
    
    return {
        "total_records": len(df),
        "total_columns": len(df.columns),
        "missing_rate_pct": round(missing_pct, 2),
        "constraint_violations": int(breaks),
        "data_quality_score": dq_score,
        "features": df.columns.tolist()
    }

def time_aware_split(df: pd.DataFrame, time_col: str = 'reporting_month', train_ratio: float = 0.8):
    """Sorts chronologically to eliminate target leakage across loan vintages."""
    df_sorted = df.sort_values(by=time_col).reset_index(drop=True)
    split_idx = int(len(df_sorted) * train_ratio)
    train_df = df_sorted.iloc[:split_idx]
    val_df = df_sorted.iloc[split_idx:]
    return train_df, val_df