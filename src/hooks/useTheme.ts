import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Themes } from '@constant/colors';

export const useTheme = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  return { 
    colors : Themes[mode], 
    mode
  }
  ;
};
