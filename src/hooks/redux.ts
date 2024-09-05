import { TypedUseSelectorHook, useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;
// Create a custom useDispatch hook with typed dispatch
export const useDispatch = () => useAppDispatch<AppDispatch>();
