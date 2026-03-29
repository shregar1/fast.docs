/** Home page Python: loaded from examples/verified/*.py (pytest-checked). */
import homeFunctionStyle from '../examples/verified/home_function_style.py?raw';
import homeClassStyle from '../examples/verified/home_class_style.py?raw';

export const WRITE_LESS_CODE_FUNCTION = homeFunctionStyle.trimEnd();
export const WRITE_LESS_CODE_CLASS = homeClassStyle.trimEnd();
