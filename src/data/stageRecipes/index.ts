import { AgeGroupData } from '../foodGuideData';
import { stageData_0_6_months } from './stage_0_6m';
import { stageData_6_8_months } from './stage_6_8m';
import { stageData_8_10_months } from './stage_8_10m';
import { stageData_10_12_months } from './stage_10_12m';
import { stageData_12_24_months } from './stage_12_24m';
import { stageData_24_36_months } from './stage_24_36m';
import { stageData_3_5_years } from './stage_3_5y';
import { stageData_5_10_years } from './stage_5_10y';
import { stageData_10_15_years } from './stage_10_15y';
import { stageData_15_18_years } from './stage_15_18y';
import {
  extraRecipes_0_6_months,
  extraRecipes_6_8_months,
  extraRecipes_8_10_months,
  extraRecipes_10_12_months,
  extraRecipes_12_24_months,
  extraRecipes_24_36_months
} from './extraRecipesInfantToddler';
import {
  extraRecipes_3_5_years,
  extraRecipes_5_10_years,
  extraRecipes_10_15_years,
  extraRecipes_15_18_years
} from './extraRecipesKidsTeens';

export const allAgeStagesData: AgeGroupData[] = [
  { ...stageData_0_6_months, recipes: [...stageData_0_6_months.recipes, ...extraRecipes_0_6_months] },
  { ...stageData_6_8_months, recipes: [...stageData_6_8_months.recipes, ...extraRecipes_6_8_months] },
  { ...stageData_8_10_months, recipes: [...stageData_8_10_months.recipes, ...extraRecipes_8_10_months] },
  { ...stageData_10_12_months, recipes: [...stageData_10_12_months.recipes, ...extraRecipes_10_12_months] },
  { ...stageData_12_24_months, recipes: [...stageData_12_24_months.recipes, ...extraRecipes_12_24_months] },
  { ...stageData_24_36_months, recipes: [...stageData_24_36_months.recipes, ...extraRecipes_24_36_months] },
  { ...stageData_3_5_years, recipes: [...stageData_3_5_years.recipes, ...extraRecipes_3_5_years] },
  { ...stageData_5_10_years, recipes: [...stageData_5_10_years.recipes, ...extraRecipes_5_10_years] },
  { ...stageData_10_15_years, recipes: [...stageData_10_15_years.recipes, ...extraRecipes_10_15_years] },
  { ...stageData_15_18_years, recipes: [...stageData_15_18_years.recipes, ...extraRecipes_15_18_years] }
];
