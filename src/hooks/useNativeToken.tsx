import { apiUrl } from 'configs/server';
import { Token } from 'models/schema';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'state';
import { setNativeToken } from 'state/application/actions';
let isLoading = false;
export const useNativeToken = () => {
  const dispatch = useDispatch();
  const nativeToken = useSelector((state: AppState) => state.application.nativeToken);
  const [error, setError] = useState(null);
  const fetchNativeToken = useCallback(async () => {
    isLoading = true;
    try {
      const response = await fetch(`${apiUrl}/tokens/native/1`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      dispatch(setNativeToken(data as Token));
    } catch (error) {
      console.log('error', error);
      setError(error as any);
    } finally {
      isLoading = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (!nativeToken && !isLoading) {
      fetchNativeToken();
    }
  }, [fetchNativeToken, nativeToken]);

  const refetch = async () => {
    await fetchNativeToken();
  };
  return { nativeToken: nativeToken, error: error, refetch: refetch };
};
