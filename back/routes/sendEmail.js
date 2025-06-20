const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises; // Используем promisified версию fs для await

const router = express.Router();

// --- Настройка Multer для сохранения файлов ---
// Директория для загрузок. Должна быть той же, что и в server.js
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads'); // '..' чтобы выйти из папки 'routes'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR); // Multer сохраняет файлы сюда
    },
    filename: (req, file, cb) => {
        // Создаем уникальное имя файла с временной меткой
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // Ограничение размера файла до 25MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg', 'image/png', 'image/gif',
            'application/pdf',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/zip', 'application/x-zip-compressed',
            'application/x-rar-compressed', // Добавлен RAR
            'application/octet-stream' // Для других типов, которые могут быть не определены, но безопасны (например, AI, CDR)
        ];
        if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|zip|rar|ai|cdr)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Неподдерживаемый тип файла. Разрешены только изображения, PDF, DOC, DOCX, XLS, XLSX, ZIP, RAR, AI, CDR.'), false);
        }
    }
});

// --- Роут для отправки email ---
router.post('/send-email', upload.array('files'), async (req, res) => {
    // Вспомогательная функция для удаления файлов
    const deleteUploadedFiles = async (fileList) => {
        if (fileList && fileList.length > 0) {
            for (const file of fileList) {
                try {
                    await fs.unlink(file.path);
                    console.log(`Файл ${file.filename} успешно удален.`);
                } catch (unlinkError) {
                    console.error(`Ошибка при удалении файла ${file.path}:`, unlinkError);
                }
            }
        }
    };

    // 1. Проверка наличия данных формы и корзины
    const { formData, cart } = req.body;
    const files = req.files;

    if (!formData || !cart) {
        await deleteUploadedFiles(files);
        return res.status(400).json({ message: 'Отсутствуют обязательные данные формы (formData или cart).' });
    }

    let parsedFormData;
    let parsedCart;
    try {
        parsedFormData = JSON.parse(formData);
        parsedCart = JSON.parse(cart);
    } catch (parseError) {
        console.error('Ошибка парсинга JSON для formData или cart:', parseError);
        await deleteUploadedFiles(files);
        return res.status(400).json({ message: 'Некорректный формат данных (formData или cart не являются валидным JSON).' });
    }

    // 2. Настройка Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lasergraficsomsk@gmail.com',
            pass: 'leab jpht vxwg nipd' // Ваш "Пароль приложения"
        }
    });

    // 3. Формирование деталей корзины для письма
    const cartDetails = parsedCart.map(item =>
        `  - ${item.name} (${item.selectedOsnastka || 'без оснастки'}) - ${item.quantity} шт. - ${(item.price * item.quantity).toFixed(2)}р`
    ).join('\n');

    const totalOrderSum = parsedCart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

    const mailOptions = {
        from: 'lasergraficsomsk@gmail.com',
        to: 'wenz5455@gmail.com',
        subject: `Новый заказ #${Date.now()} от ${parsedFormData.name}`,
        text: `
Новый заказ получен!

Данные покупателя:
Имя: ${parsedFormData.name}
Email: ${parsedFormData.email}
Телефон: ${parsedFormData.phone}

--- Состав заказа ---
${cartDetails}
--------------------
Общая сумма заказа: ${totalOrderSum}р
`,
        attachments: files.map(file => ({
            filename: file.originalname,
            path: file.path
        }))
    };

    // 4. Отправка письма и обработка результата
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email успешно отправлен:', info.response);

        await deleteUploadedFiles(files); // Удаляем файлы после успешной отправки

        res.status(200).json({ message: 'Ваш заказ успешно отправлен!' });
    } catch (error) {
        console.error('Ошибка при отправке email через Nodemailer:', error);
        await deleteUploadedFiles(files); // Удаляем файлы даже в случае ошибки отправки почты

        if (error.code === 'EENVELOPE' || error.code === 'EAUTH') {
            res.status(500).json({ message: 'Ошибка настройки почтового сервера. Проверьте данные отправителя (логин/пароль приложения).' });
        } else {
            res.status(500).json({ message: 'Внутренняя ошибка сервера. Не удалось отправить заказ. Попробуйте еще раз или свяжитесь с поддержкой.' });
        }
    }
});

module.exports = router;