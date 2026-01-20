
export type RatingValue = '1' | '2' | '3' | '4' | '';

export interface EvaluationRatings {
  [category: string]: {
    [item: string]: RatingValue;
  };
}

export interface Evaluation {
  id: string;
  firstName: string;
  lastName: string;
  academicYear: string;
  trimester: string;
  date: string;
  ratings: EvaluationRatings;
}

export interface CategoryItem {
  id: string;
  label: string;
}

export interface EvaluationCategory {
  id: string;
  title: string;
  subtitle: string;
  items: CategoryItem[];
}
