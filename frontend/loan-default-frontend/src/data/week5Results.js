// Week-5 evaluation results (Loan_Default_Week_5_Model_Evaluation.ipynb).
// Original-model + CV + tuned-model numbers are final (GridSearchCV completed).
export const WEEK5 = {
  dataset: { rows: 255347, noDefault: 225694, def: 29653, trainRows: 204277, testRows: 51070 },
  original: {
    accuracy: 0.8847072645388682,
    precision: 0.7171717171717171,
    recall: 0.011970999831394368,
    f1: 0.023548922056384744,
    trainAccuracy: 1.0,
    testAccuracy: 0.8847072645388682,
    cm: [[45111, 28], [5860, 71]]
  },
  cv: {
    accuracyMean: 0.8845391301463813,
    accuracyStd: 0.00011154050505029128,
    f1Mean: 0.020675918247391387,
    f1Std: 0.0014932276994179202
  },
  tuning: {
    status: "completed",
    combos: 8,
    folds: 3,
    fits: 24,
    scoring: "f1",
    grid: {
      n_estimators: [100, 200],
      max_depth: [10, 20],
      min_samples_split: [2],
      min_samples_leaf: [1, 2]
    },
    bestParams: {
      n_estimators: 200,
      max_depth: 10,
      min_samples_split: 2,
      min_samples_leaf: 1
    }
  },
  tuned: {
    accuracy: 0.7305854709222636,
    precision: 0.2454474505723205,
    recall: 0.6363176530096105,
    f1: 0.354249777068569
  }
};
