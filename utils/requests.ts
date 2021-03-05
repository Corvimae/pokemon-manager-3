import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { requestDetails, ActiveDetailType } from "../store/pokemon";

export const API_ENDPOINT = '/api/v1/';

export function useRequestData(type: ActiveDetailType) {
  const dispatch = useDispatch();

  return useCallback((id: number) => {
    dispatch(requestDetails(type, id));
  }, [dispatch]);
}