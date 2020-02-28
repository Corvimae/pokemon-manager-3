import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { requestDetails, ActiveDetailType } from "../store/store";

export const API_ENDPOINT = 'http://localhost:80/api/v2/';

export function useRequestData(type: ActiveDetailType) {
  const dispatch = useDispatch();

  return useCallback((id: number) => {
    dispatch(requestDetails(type, id));
  }, [dispatch]);
}