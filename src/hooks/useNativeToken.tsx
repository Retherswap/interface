import { apiUrl } from 'configs/server';
import { TokenModel } from 'models/TokenModel';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'state';
import { setNativeToken } from 'state/application/actions';

export const useNativeToken = () => {
  const dispatch = useDispatch();
  const nativeToken = useSelector((state: AppState) => state.application.nativeToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchNativeToken = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/tokens/native/1`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      dispatch(setNativeToken(data as TokenModel));
    } catch (error) {
      console.log('error', error);
      setError(error as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!nativeToken && !loading) {
      console.log('fetching native token');
      fetchNativeToken();
    }
  }, [loading]);

  const refetch = async () => {
    await fetchNativeToken();
  };
  return { nativeToken: nativeToken, loading: loading, error: error, refetch: refetch };
};
