import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useSelector, useDispatch } from '@services/store';
import {
  clearErrors,
  errorSelector,
  registerUserThunk
} from '@services/slices/userSlice/userSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(errorSelector);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUserThunk({
        name: userName,
        email,
        password
      })
    ).then((action) => {
      if (registerUserThunk.fulfilled.match(action)) {
        navigate('/');
      }
    });
  };

  useEffect(() => {
    dispatch(clearErrors());
  }, []);

  return (
    <RegisterUI
      errorText={error!}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
