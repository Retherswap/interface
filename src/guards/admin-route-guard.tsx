import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'state';
import { setRequestConnection } from 'state/application/actions';

export default function AdminRouteGuard({ children }) {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state: AppState) => state.application.isAdmin);
  const token = useSelector((state: AppState) => state.application.loginToken);
  if (!isAdmin || !token) {
    dispatch(setRequestConnection(true));
    return <h1>Not authorized</h1>;
  }
  return children;
}
