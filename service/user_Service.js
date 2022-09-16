require('dotenv').config();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const { json } = require('express');
const nodemailer = require('nodemailer');

class userService {

    async getAllUsers(){
        try {
            const allUsers = await prisma.usuario.findMany()
            return allUsers;
        }
        catch (err) {
            console.error(err.message);
            throw err
        }
    }

    async createUser(userInfo){
        try {
            const { nombreUsuario, password, mail, nombre, apellido, edad } = userInfo

            const hashedPassword = bcrypt.hashSync(password, 10)

            const findUser = await prisma.usuario.findFirst({
                where: {
                    nombreUsuario,
                    mail
                }
            })

            if(findUser){
                throw new Error('User already exists')
            }

            const newUser = await prisma.usuario.create({
                data: {
                    nombreUsuario,
                    password: hashedPassword,
                    mail,
                    nombre,
                    apellido,
                    edad
                }
            })

            return newUser
        } 
        catch (err) {
            console.error(err.message);
        }
    }

    async updatePassword(userInfo){
        try {
            const { nombreUsuario, password, nuevaPassword } = userInfo

            if(password == nuevaPassword){
                throw new Error('New password is the same as the old password')
            }

            const hashedNewPassword = bcrypt.hashSync(nuevaPassword, 10)

            const userName = await prisma.usuario.findFirst({
                where: {
                    nombreUsuario
                }
            })

            const matches = bcrypt.compareSync(password, userName.password)

            if(!matches){
                throw new Error('Wrong Password')
            }

            if(!userName){
                throw new Error('You are not logged in')
            }

            const user = await prisma.usuario.update({
                where: {
                    nombreUsuario
                },
                data: {
                    password: hashedNewPassword
                }
            })
            return user
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async deleteUser(userInfo){
        try {
            const { nombreUsuario } = userInfo

            const user = await prisma.usuario.delete({
                where: {
                    nombreUsuario
                }
            })
            return user
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async sendEmail(userInfo){
        try {
            const { email } = userInfo

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'Contact.GroupIT.App@gmail.com',
                    pass: process.env.EMAIL_KEY
                }
            });
              
            const mailOptions = {
                from: 'Contact.GroupIT.App@gmail.com',
                to: email,
                subject: 'mando mails',
                text: 'Este texto confirma alegremente que puedo mandar mails por segundo año consecutivo'
            };
              
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            return json({ message : "Email sent succesfully!" });
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async getEmail(userInfo){
        try {
            const { nombreUsuario } = userInfo

            const user = await prisma.usuario.findFirst({
                where: {
                    nombreUsuario
                },
                select: {
                    mail: true
                }
            })

            if(!user){
                throw new Error("That user doesn't exist");
            }

            return user;
        }
        catch (err) {
            console.error(err.message);
        }
    }
}

module.exports = new userService()