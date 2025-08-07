import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse,
    IconButton,
    Paper,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
  } from '@mui/material';
  import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const [mail, setMail] = useState('umut@umut.umut');
    const [sifre, setSifre] = useState('umut');
    const [adi, setAdi] = useState('');
    const [sifreTekrar, setSifreTekrar] = useState('');
    const [open, setOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [message, setMessage] = useState('');
    const [gorevler, setGorevler] = useState([]); 
    const navigate = useNavigate();
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        const fetchTasksAndUsers = async () => {
            try {
                const gorevResponse = await fetch('http://localhost:8080/api/gorev');
                
                if (gorevResponse.ok) {
                    const gorevData = await gorevResponse.json();
                    
                    const publicGorevler = gorevData
                        .filter((gorev) => gorev.tur === 'public')
                        .map((gorev) => ({
                            ...gorev,
                        }));
                    
                    setGorevler(publicGorevler);
                }
            } catch (error) {
                console.error('Hata:', error);
            }
        };
    
        fetchTasksAndUsers();
    }, []);

    const handleRowClick = (rowId) => {
        setExpandedRow(expandedRow === rowId ? null : rowId);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/kullanici');
            if (response.ok) {
                const result = await response.json();
                const user = result.find(
                    (item) => item.mail.trim() === mail && item.sifre === sifre
                );

                if (user) {
                    onLoginSuccess(user.id);
                    navigate('/gorev', { state: { kullaniciId: user.id } });
                } else {
                    setMessage('Girilen bilgiler hatalı!');
                }
            } else {
                setMessage('Sunucuyla bağlantı kurulamadı!');
            }
        } catch (error) {
            console.error('Hata:', error);
            setMessage('Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.');
        }

        setMail('');
        setSifre('');
        setAdi('');
        setSifreTekrar('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
    
        if (!mail || !sifre || !adi || !sifreTekrar) {
            setMessage('Lütfen tüm alanları doldurunuz.');
            return;
        }
    
        if (sifre !== sifreTekrar) { 
            setMessage('Şifreler eşleşmiyor!');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/api/kullanici', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mail: mail.trim(),
                    sifre: sifre,
                    adi: adi.trim(),
                }),
            });
    
            if (response.ok) {
                alert('Kayıt başarılı..');
                setIsRegistering(false);
            } else {
                setMessage('Kayıt işlemi başarısız oldu. Lütfen tekrar deneyiniz.');
            }
        } catch (error) {
            console.error('Hata:', error);
            setMessage('Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.');
        }
    
        setMail('');
        setSifre('');
        setAdi('');
        setSifreTekrar('');
    };
      

    const handleOpen = () => {
        setMessage('');
        setOpen(true);
    };

    const handleClose = () => {
        setMessage('');
        setOpen(false);
        setIsRegistering(false);
        setMail('');
        setSifre('');
        setAdi('');
        setSifreTekrar('');
    };

    const switchToRegister = () => {
        setMessage('');
        setIsRegistering(true);
    };

    const switchToLogin = () => {
        setMessage('');
        setIsRegistering(false);
    };

    return (
        <div>
            <TableContainer component={Paper} className="login-TableContainer" sx={{mt:15}}>
                <Typography variant="h4" className="login-Typography">
                    Görevler
                </Typography>
                <Table className="login-Table">
                    <TableHead className="login-TableHead">
                    <TableRow>
                        <TableCell />
                        <TableCell><b>Kullanıcı Adı</b></TableCell>
                        <TableCell><b>Başlık</b></TableCell>
                        <TableCell><b>Durum</b></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody className="login-TableBody">
                    {gorevler.map((gorev) => (
                        <React.Fragment key={gorev.id}>
                        <TableRow>
                            <TableCell>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => handleRowClick(gorev.id)}
                                className="login-IconButton"
                            >
                                {expandedRow === gorev.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                            </TableCell>
                            <TableCell>{gorev.kullanici.adi}</TableCell>
                            <TableCell>{gorev.baslik}</TableCell>
                            <TableCell>{gorev.durum}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                            <Collapse
                                in={expandedRow === gorev.id}
                                timeout="auto"
                                unmountOnExit
                                style={{ transition: 'height 0.3s ease-out' }}
                            >
                                <Box margin={1} className="login-CollapsibleBox">
                                <Typography variant="body2" className="login-TypographyBody2">
                                    <b>Açıklama:</b> {gorev.aciklama}
                                </Typography>
                                <Typography variant="body2" className="login-TypographyBody2">
                                    <b>Başlangıç Tarihi:</b> {gorev.baslangicTarihi}
                                </Typography>
                                <Typography variant="body2" className="login-TypographyBody2">
                                    <b>Bitiş Tarihi:</b> {gorev.bitisTarihi}
                                </Typography>
                                <Typography variant="body2" className="login-TypographyBody2">
                                    <b>Derece:</b> {gorev.derece}
                                </Typography>
                                </Box>
                            </Collapse>
                            </TableCell>
                        </TableRow>
                        </React.Fragment>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Giriş Yap ve Kayıt Ol Formu */}
            <Button
                variant="contained"
                color="primary"
                style={{ position: 'absolute', top: 10, right: 10 }}
                onClick={handleOpen}
            >
                Giriş Yap
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <Typography variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                        {isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {message && (
                        <Typography color="error" style={{ marginBottom: '1rem' }}>
                            {message}
                        </Typography>
                    )}
                    {isRegistering ? (
                        <form onSubmit={handleRegister}>
                            <TextField
                                label="Adı"
                                type="text"
                                fullWidth
                                margin="normal"
                                value={adi}
                                onChange={(e) => setAdi(e.target.value)}
                            />
                            <TextField
                                label="E-posta"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                            />
                            <TextField
                                label="Şifre"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={sifre}
                                onChange={(e) => setSifre(e.target.value)}
                            />
                            <TextField
                                label="Şifre Tekrar"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={sifreTekrar}
                                onChange={(e) => setSifreTekrar(e.target.value)}
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Kayıt Ol
                            </Button>
                            <Button
                                variant="text"
                                color="info"
                                fullWidth
                                onClick={switchToLogin}
                            >
                                Giriş Yap
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <TextField
                                label="E-posta"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                            />
                            <TextField
                                label="Şifre"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={sifre}
                                onChange={(e) => setSifre(e.target.value)}
                            />
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Giriş Yap
                            </Button>
                            <Button
                                variant="text"
                                color="info"
                                fullWidth
                                onClick={switchToRegister}
                            >
                                Kayıt Ol
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Login;