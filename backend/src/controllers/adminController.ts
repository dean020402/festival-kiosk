import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const verifyPin = async (req:Request, res:Response) => {
    try{
        const {pin} =req.body();

        if (!pin){
            return res.status(400).json({
                success: false,
                message: 'PIN 번호를 입력해주세요.',
            });
        }

        const CORRECT_PIN =process.env.ADMIN_PIN || '3457';

        if (pin===CORRECT_PIN) {
            const token =jwt.sign(
                {role:'admin'},
                process.env.JWT_SECRET || 'secret',
                { expiresIn :'2h'}
            );
            return res.status(200).json({
                success: true,
                message:'인증에 성공했습니다',
                token: token,
            });
        } else{
            return res.status(401).json({
                success: false,
                messange: '비밀번호가 올바르지 않습니다.'
            });
        }
    } catch (error) {
        console.error('PIN verify error:',error);
        return res.status(500).json({
            success: false,
            message: '서버 내부 오류가 발생했습니다.',
        });
    }
};