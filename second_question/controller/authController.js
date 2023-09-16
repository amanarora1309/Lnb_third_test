import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import User from '../models/userModel.js'
import Otp from '../models/otpModel.js';
import JWT from 'jsonwebtoken';
import sendMail from '../mailers/mail.js';





export const otpForResetPassword = async (req, res) => {

    try {
        const { email } = req.body;

        // validation
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'email is required'
            })
        }

        // check user is valid or not
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: "false",
                message: "user not found"
            })
        }

        // send mail
        const otp = Math.trunc(Math.random() * 9999);
        const text = `OTP is ${otp} `;
        const subject = 'OTP for Reset Password of Ecommerce App'
        const to = user.email

        await sendMail(to, subject, text);

        // save otp in database
        const d = new Date();
        const saveOtp = await Otp.create({
            id: user._id,
            otp: otp,
            time: d.getTime()
        })

        res.status(200).send({
            success: true,
            message: "OTP Send Successfully"
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in otp send',
            error
        })
    }





}

export const verifyOtpForResetPassword = async (req, res) => {

    try {
        const { email, otp, n_password } = req.body;

        // validation
        if (!email) {
            return res.status(400).send({ success: false, message: 'email is required' })
        }
        if (!otp) {
            return res.status(400).send({ success: false, message: 'otp is required' })
        }
        if (!n_password) {
            return res.status(400).send({ success: false, message: 'new Password is required' })
        }

        // find user 

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "user not found"
            })
        }


        const otpdb = await Otp.findOne({ id: user._id });
        const d = new Date();

        // check otp is valid or not

        if (otp !== otpdb.otp) {
            return res.status(400).send({ success: false, message: "Invalid OTP" })
        }

        // check otp expiration
        if (((d.getTime() - otpdb.time) / 1000 / 60) > 10) {
            return await Otp.deleteOne({ id: user._id }).then((d_res) => {


                res.status(400).send({ success: false, message: "OTP has been expired !! Please genrate a new OTP" })
            }).catch((err) => {
                res.status(500).send({ status: 500, message: "Something went wrong" });
            });


        }

        // genrate a hash
        const hash = await hashPassword(n_password);

        // update a password
        await User.findByIdAndUpdate(user._id, { password: hash }).then((result) => {

            // delete otp in database
            Otp.deleteOne({ id: user._id }).then((d_result) => {
                res.status(200).send({ success: true, message: "Password Reset Successfully" });
            }).catch((err) => {
                res.status(500).send({ status: 500, message: "Something went wrong" });
            });

        }).catch((err) => {
            res.status(500).send({ status: 500, message: "Something went wrong" });
        });



    } catch (error) {
        res.status(500).send({
            stauts: false,
            message: 'Error in reset password',
            error
        })
    }

}