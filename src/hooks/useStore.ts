import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";



export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: ()=> AppDispatch = useDispatch;