import { Button, Link, IconButton } from '@mui/material'
import styles from "./index.module.css"
import { initialUser, userOutput } from './service';
import { useFormik } from 'formik'
import { userSchema } from '../../validation';
import { signupAPI } from '../../api';
import { DynamicUser, User } from '../../models/general';

function SignUp() {
    console.log("check")


    const { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
        initialValues: initialUser,
        validationSchema: userSchema,
        onSubmit: async (user: User) => {

            console.log(values)
            const response = await signupAPI(user)
            console.log(response);
        },


    });


    console.log(errors)

    return (
        <>
            <form className={styles.page} onSubmit={handleSubmit}>

                <IconButton className={styles.closeIcon}>X</IconButton>

                <div className={styles.page__container}>

                    <div className={styles.title}>Sign Up</div>

                    <div>By continuing, you agree to our User Agreement and<br /> acknowledge that you understand the Privacy Policy.</div>

                    <div className={styles.button_container}>

                        {userOutput.map(({ key, type, desc }) => {
                            return (
                                <>
                                    {/* <span>{desc}</span> */}
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