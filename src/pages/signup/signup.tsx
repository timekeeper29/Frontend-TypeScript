import { Button, Link, IconButton } from '@mui/material'
import styles from "./index.module.css"
import { initialUser, userOutput } from './service';
import { useFormik } from 'formik'
import { userSchema } from '../../validation';
import { signupAPI } from '../../api/auth_api';
import { DialogPage, User, UserOS } from '../../models/general';
import { login } from '../navbar/service';
import { useNavigate } from 'react-router';
import { useDialogContext } from '../../contexts/PageContext';
import { useErrorContext } from '../../contexts/ErrorContext';

function SignUp() {

    const navigate = useNavigate();

    const { setPage } = useDialogContext()
    const { setMessage } = useErrorContext()



    const { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
        initialValues: initialUser,
        validationSchema: userSchema,
        onSubmit: async (user: UserOS) => {

            try {
                const response = await signupAPI(user)
                const accessToken = response.data.token
                const userInfo = response.data.userInfo

                login(accessToken, userInfo)
                setPage(DialogPage.None)


            } catch (error: any) {
                const errorMessage = error.response.data.errors[0]
                setMessage({ display: true, message: errorMessage, seveirity: 'error' })
            }
        },


    });

    return (
        <>
            <form className={styles.page} onSubmit={handleSubmit}>

                <IconButton className={styles.closeIcon} onClick={() => setPage(DialogPage.None)}>X</IconButton>

                <div className={styles.page__container}>

                    <div className={styles.title}>Sign Up</div>

                    <div>By continuing, you agree to our User Agreement and<br /> acknowledge that you understand the Privacy Policy.</div>

                    <div className={styles.button_container}>

                        {userOutput.map(({ key, type, desc }) => {
                            return (
                                <>
                                    <input
                                        type={type}
                                        id={key}
                                        className={`${styles.input} ${(errors[key] && touched[key] ? styles.inputError : "")}`}
                                        placeholder={desc}
                                        onChange={handleChange}
                                        value={values[key]}
                                        onBlur={handleBlur}
                                    >
                                    </input>
                                    {errors[key] && touched[key] && <span className={styles.error}>{errors[key]}</span>}
                                </>
                            )
                        })}
                    </div>

                    <div>
                        <span>Already a redditor  </span>
                        <Link href="#" underline="none">Log In</Link>
                    </div>
                    <Button type="submit" variant='contained'>Continue</Button>

                </div>
            </form >
        </>
    );
}



export default SignUp;