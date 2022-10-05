require('dotenv').config();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const { json } = require('express');
const nodemailer = require('nodemailer');

class userService {

    async getUser({ nombreUsuario }){
        return await prisma.usuario.findFirst({
            where: {
                nombreUsuario
            }
        }) 
    }
    
    async getAllUsers(){
        return await prisma.usuario.findMany()
    }

    async createUser(userInfo){

        const { nombreUsuario, password, mail, nombre, apellido, edad } = userInfo

        const hashedPassword = bcrypt.hashSync(password, 10)

        const checkUsername = await this.getUser({ nombreUsuario })

        if(checkUsername){
            throw new Error('User has already been taken')
        }

        const checkMail = await prisma.usuario.findFirst({
            where: {
                mail
            }
        })

        if(checkMail){
            throw new Error('Mail has already been taken')
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

    async updatePassword(userInfo){

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

        if(!userName){
            throw new Error('You are not logged in')
        }

        const matches = bcrypt.compareSync(password, userName.password)

        if(!matches){
            throw new Error('Wrong Password')
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

    async deleteUser(userInfo){
        const { nombreUsuario } = userInfo

        const user = await prisma.usuario.delete({
            where: {
                nombreUsuario
            }
        })

        if(!user){
            throw new Error('User not found')
        }

        return user
    }

    async sendEmail(userInfo){

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
                throw new Error("Error sending email");
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return json({ message : "Email sent succesfully!" });

    }
}

module.exports = new userService()





