import React, { useState, useEffect } from 'react';
import './Gorev.css';
import {
  Button,
  Tooltip,
  TextField,
  Collapse,
  Typography,
  Avatar,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Menu,
  DialogActions,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faCheck, faUndo } from '@fortawesome/free-solid-svg-icons';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SendIcon from '@mui/icons-material/Send';
import ShareIcon from '@mui/icons-material/Share';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from "@mui/material/Badge";

import { useLocation, useNavigate } from 'react-router-dom';

const aciklamayiKisitla = (aciklama) => {
  return aciklama.length > 100 
  ? aciklama.match(/.{1,100}/g).join('\n')
  : aciklama;
}

function Gorev() {
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [derece, setDerece] = useState('');
  const [baslangicTarihi, setBaslangicTarihi] = useState('');
  const [bitisTarihi, setBitisTarihi] = useState('');
  const [tur, setTur] = useState('');
  const [uyariSuresi, setUyariSuresi] = useState('');
  const [gorevler, setGorevler] = useState([]);
  const [duzenlemeDurumu, setDuzenlemeDurumu] = useState(false);
  const [duzenlenecekId, setDuzenlenecekId] = useState(null);
  const [seciliGorev, setSeciliGorev] = useState(null);
  const [gorevEklemeGizliMi, setGorevEklemeGizliMi] = useState(false);
  const [anchorElMenu1, setAnchorElMenu1] = useState(null);
  const [anchorElMenu2, setAnchorElMenu2] = useState(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [unfilteredGorevler, setUnfilteredGorevler] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({
    column: null,
    direction: 'asc',
  });  
  const [expandedRows, setExpandedRows] = useState({});
  const location = useLocation();
  const { kullaniciId } = location.state || {};
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [kullanici, setKullanici] = useState(null);
  const [password, setPassword] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [error, setError] = React.useState(false);

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = React.useState('');
  const [sifreYenileDialogOpen, setSifreYenileDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [gonderDialogOpen, setGonderDialogOpen] = useState(false);
  const [digerKullanicilar, setDigerKullanicilar] = React.useState([]);
  const [mevcutGorev, setMevcutGorev] = React.useState(null);
  const [secilenKullaniciId, setSecilenKullaniciId] = React.useState("");
  const [paylasDialogOpen, setPaylasDialogOpen] = useState(false);
  const [bildirimDialogOpen, setBildirimDialogOpen] = React.useState(false);
  const [gorevDetayDialogOpen, setGorevDetayDialogOpen] = useState(false);
  const [selectedGorev, setSelectedGorev] = useState(null);
  
  useEffect(() => {
      const fetchTasksAndUsers = async () => {
        try {
            const gorevResponse = await fetch('http://localhost:8080/api/gorev');
            if (gorevResponse.ok) {
                const gorevData = await gorevResponse.json();

                const publicGorevler = gorevData
                    .filter((gorev) => gorev.kullanici.id === kullaniciId)
                    .map((gorev) => ({
                        ...gorev,
                    }));
                
                setGorevler(publicGorevler);
            }

            const kullaniciData = await fetchKullanici(kullaniciId);
            setKullanici(kullaniciData);
        } catch (error) {
            console.error('Hata:', error);
        }
    };

    fetchTasksAndUsers();
  }, [kullaniciId]);

  const fetchKullanici = async (kullaniciId) => {
    const response = await fetch(`http://localhost:8080/api/kullanici/${kullaniciId}`);
    if (response.ok) {
        return await response.json();
    }
  };

  const handleRowClick = (index) => {
      setExpandedRows((prev) => ({
          ...prev,
          [index]: !prev[index],
      }));
  };
  
  const handleCancel = async (id) => {
    const gorev = gorevler.find((g) => g.id === id);
    if (!gorev) return;

    const guncellenmisGorev = { ...gorev, durum: 'İptal Edildi' };

    const response = await fetch(`http://localhost:8080/api/gorev/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guncellenmisGorev),
    });

    if (!response.ok) return;

    const updatedData = await response.json();

    const yeniGorevler = gorevler.map((g) => (g.id === id ? updatedData : g));
    setGorevler(yeniGorevler);
    setUnfilteredGorevler(yeniGorevler);
  };

  const handleContinue = async (id) => {
      handleCloseMenu();
      const gorev = gorevler.find((g) => g.id === id);
      if (!gorev) return;

      const guncellenmisGorev = { ...gorev, durum: 'Devam Ediyor' };

      const response = await fetch(`http://localhost:8080/api/gorev/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guncellenmisGorev),
      });

      if (!response.ok) return;

      const updatedData = await response.json();

      const yeniGorevler = gorevler.map((g) => (g.id === id ? updatedData : g));
      setGorevler(yeniGorevler);
      setUnfilteredGorevler(yeniGorevler);
  };

  const handleComplete = async (id) => {
      const gorev = gorevler.find((g) => g.id === id);
      if (!gorev) return;

      const guncellenmisGorev = { ...gorev, durum: 'Tamamlandı' };

      const response = await fetch(`http://localhost:8080/api/gorev/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guncellenmisGorev),
      });

      if (!response.ok) return;

      const updatedData = await response.json();

      const yeniGorevler = gorevler.map((g) => (g.id === id ? updatedData : g));
      setGorevler(yeniGorevler);
      setUnfilteredGorevler(yeniGorevler);
  };

  const gorevEkle = async () => {
    const kullanici = await fetchKullanici(kullaniciId);
    if (baslik && aciklama && derece && baslangicTarihi && bitisTarihi && tur && kullaniciId && uyariSuresi) {
        const yeniGorev = {
            baslik,
            aciklama,
            derece,
            baslangicTarihi,
            bitisTarihi,
            durum: 'Devam Ediyor',
            tur,
            kullanici,
            uyariSuresi,
        };

        fetch('http://localhost:8080/api/gorev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(yeniGorev),
        })
        .then((response) => response.ok && response.json())
        .then((data) => {
            setGorevler((prevGorevler) => [...prevGorevler, data]);
            setBaslik('');
            setAciklama('');
            setDerece('');
            setBaslangicTarihi('');
            setBitisTarihi('');
            setTur('');
            setUyariSuresi('');
            setGorevEklemeGizliMi(false);
        });
    }
  };

  const duzenlemeyeBasla = (gorevId) => {
    const tmpGorev = gorevler.find((grv)=>grv.id === gorevId);
    handleCloseMenu();
    setDuzenlemeDurumu(true);
    setDuzenlenecekId(tmpGorev.id);
    setBaslik(tmpGorev.baslik);
    setAciklama(tmpGorev.aciklama);
    setDerece(tmpGorev.derece);
    setUyariSuresi(tmpGorev.uyariSuresi);
    setBaslangicTarihi(tmpGorev.baslangicTarihi);
    setBitisTarihi(tmpGorev.bitisTarihi);
    setTur(tmpGorev.tur);
  };

  const duzenlemeyiKaydet = async () => {
    const kullanici = await fetchKullanici(kullaniciId);
    const gorev = gorevler.find((g) => g.id === duzenlenecekId);
    if (!gorev) return;

    const guncellenmisGorev = {
        baslik,
        aciklama,
        derece,
        baslangicTarihi,
        bitisTarihi,
        durum: gorev.durum,
        tur,
        kullanici,
        uyariSuresi,
    };

    fetch(`http://localhost:8080/api/gorev/${duzenlenecekId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guncellenmisGorev),
    })
        .then((response) => response.ok && response.json())
        .then((data) => {
            const yeniGorevler = [...gorevler];
            const gorevIndex = gorevler.findIndex((g) => g.id === duzenlenecekId);
            yeniGorevler[gorevIndex] = data;
            setGorevler(yeniGorevler);
            setUnfilteredGorevler(yeniGorevler);

            setDuzenlemeDurumu(false);
            setDuzenlenecekId(null);
            setBaslik('');
            setAciklama('');
            setDerece('');
            setBaslangicTarihi('');
            setBitisTarihi('');
            setTur('');
            setUyariSuresi('');
        });
  };

  const gorevSil = (id) => {
    handleCloseMenu();

    fetch(`http://localhost:8080/api/gorev/${id}`, { method: 'DELETE' })
        .then((response) => response.ok && gorevler.filter((gorev) => gorev.id !== id))
        .then((guncellenmisGorevler) => {
            setGorevler(guncellenmisGorevler);
            setUnfilteredGorevler(guncellenmisGorevler);
            localStorage.setItem('gorevler', JSON.stringify(guncellenmisGorevler));
            setAnchorElMenu1(null);
        });
  };

  const formuSifirla = () => {
    setBaslik('');
    setAciklama('');
    setDerece('');
    setBaslangicTarihi('');
    setBitisTarihi('');
    setTur('');
    setUyariSuresi('');
    setGorevEklemeGizliMi(false);
  };

  const handleClickMenu = (event, indeks) => {
    setAnchorElMenu1(event.currentTarget);
    setSelectedTaskIndex(indeks);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu1(null);
    setAnchorElMenu2(null);
    setSelectedTaskIndex(null);
  };
  
  const sortBy = (type) => {
    let sortedGorevler = [...gorevler];
    let direction = 'asc';
  
    if (sortConfig.column === type && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
  
    if (type === 'gorevBaslik') {
      sortedGorevler.sort((a, b) => {
        const compare = a.baslik.localeCompare(b.baslik);
        return direction === 'asc' ? compare : -compare;
      });
    } else if (type === 'derece') {
      sortedGorevler.sort((a, b) => {
        return direction === 'asc' ? a.derece - b.derece : b.derece - a.derece;
      });
    } 
  
    setSortConfig({ column: type, direction });
    setGorevler(sortedGorevler);
  };   

  const filteredGorevler = gorevler.filter((gorev) => {
    return gorev?.kullanici?.id === kullaniciId && 
    gorev?.baslik?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleFilterClick = (event) => {
    setAnchorElMenu2(event.currentTarget);
  };

  const handleFilterModalClose = () => {
    setOpenFilterModal(false); 
  };

  const handleApplyFilter = async () => {
    let apiUrl = "http://localhost:8080/api/gorev";
  
    if (filterType === "date" && filterDate) {
      apiUrl += `/tarih/${filterDate}`;
    } else if (filterType === "status" && filterStatus) {
      apiUrl += `/durum/${filterStatus}`;
    }
  
    const response = await fetch(apiUrl);
    const filteredGorevler = await response.json();
  
    setGorevler(filteredGorevler);
    setOpenFilterModal(false);
  };

  const handleRemoveFilter = async () => {
    const response = await fetch("http://localhost:8080/api/gorev");
    const allGorevler = await response.json();
    
    const filteredGorevler = allGorevler.filter(gorev => gorev.kullanici.id === kullaniciId);
    
    setGorevler(filteredGorevler);
  };
  
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout= () => {
    navigate('/login');
  }

  const handleProfileClick = () => {
    setSelectedUser();
    setModalOpen(true);
    setAnchorEl(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handlePasswordVerification = () => {
    if (password === kullanici.sifre) {
      setConfirmationDialogOpen(true); 
      setDeleteDialogOpen(false); 
      setError(false);
    } else {
      setError(true);
    }
  };
  
  const handleKullaniciDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/kullanici/${kullanici.id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setKullanici(null); 
        setGorevler([]); 
        setConfirmationDialogOpen(false); 
        setPassword('');
        handleLogout(); 
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  };
  
  const handleKullaniciUpdate = async () => {
    if (!kullanici.adi || !kullanici.mail) {
        //console.log(kullanici.sifre);
        setError('Tüm alanları doldurmanız gerekiyor!');
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/api/kullanici/${kullanici.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ... kullanici,
                adi: kullanici.adi,
                mail: kullanici.mail,
            }),
        });

        if (response.ok) {
            setEditDialogOpen(false);
            alert('Bilgiler başarıyla güncellendi!');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
  };

  const handleSifreGuncelle = async () => {
    if (!oldPassword || !newPassword || !newPasswordRepeat) {
        setError('Tüm alanları doldurmanız gerekiyor!');
        return;
    }
    if (oldPassword !== kullanici.sifre) {
        setError('Eski şifre hatalı!');
        return;
    }
    if (newPassword !== newPasswordRepeat) {
        setError('Yeni şifreler eşleşmiyor!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/kullanici/${kullanici.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              ... kullanici,
              sifre: newPassword, 
            }),
        });

        if (response.ok) {
            setSifreYenileDialogOpen(false);
            alert('Şifre başarıyla güncellendi!');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
  };

  const handleEditOpen = () => {
    setOldPassword('');
    setNewPassword(''); 
    setNewPasswordRepeat(''); 
    setError(''); 
    setEditDialogOpen(true); 
  };
  
  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setOldPassword('');
    setNewPassword('');
    setNewPasswordRepeat('');
    setError('');
  };

  const handleSifreYenileOpen = () => {
    setOldPassword('');
    setNewPassword('');
    setNewPasswordRepeat('');
    setError('');
    setSifreYenileDialogOpen(true);
  };

  const handleSifreYenileClose = () => {
      setOldPassword('');
      setNewPassword('');
      setNewPasswordRepeat('');
      setError('');
      setSifreYenileDialogOpen(false);
  };

  const handleGonderDialogOpen = async (gorevId, currentUserId) => {
    try {
      setSecilenKullaniciId(""); 
      setMevcutGorev(null); 
      setDigerKullanicilar([]); 
  
      const gorevResponse = await fetch(`http://localhost:8080/api/gorev/${gorevId}`);
      if (!gorevResponse.ok) throw new Error("Görev alınamadı.");
      const gorev = await gorevResponse.json();
      setMevcutGorev(gorev);
  
      const kullaniciResponse = await fetch("http://localhost:8080/api/kullanici");
      if (!kullaniciResponse.ok) throw new Error("Kullanıcılar alınamadı.");
      const tumKullanicilar = await kullaniciResponse.json();
  
      const digerler = tumKullanicilar.filter(user => user.id !== currentUserId);
      setDigerKullanicilar(digerler);
  
      setGonderDialogOpen(true);
    } catch (error) {
      console.error("Hata:", error.message);
    }
  };
  
  const handleGorevGuncelle = async () => {
    try {
      if (secilenKullaniciId && digerKullanicilar.some(user => user.id == secilenKullaniciId)) {
        const updatedGorev = {
          ...mevcutGorev,
          kullanici: { id: parseInt(secilenKullaniciId) },
        };
  
        const updateResponse = await fetch(`http://localhost:8080/api/gorev/${mevcutGorev.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedGorev),
        });
  
        if (updateResponse.ok) {
          alert("Görev başarıyla seçilen kullanıcıya atandı!");
          setGonderDialogOpen(false);
          window.location.reload();
        } else {
          throw new Error("Görev güncellenirken bir hata oluştu.");
        }
      }
    } catch (error) {
      console.error("Hata:", error.message);
    }
  };

  const handlePaylasDialogOpen = async (gorevId, currentUserId) => {
    try {
      setSecilenKullaniciId(""); 
      setMevcutGorev(null); 
      setDigerKullanicilar([]); 
  
      const gorevResponse = await fetch(`http://localhost:8080/api/gorev/${gorevId}`);
      if (!gorevResponse.ok) throw new Error("Görev alınamadı.");
      const gorev = await gorevResponse.json();
      setMevcutGorev(gorev);
  
      const kullaniciResponse = await fetch("http://localhost:8080/api/kullanici");
      if (!kullaniciResponse.ok) throw new Error("Kullanıcılar alınamadı.");
      const tumKullanicilar = await kullaniciResponse.json();
  
      const digerler = tumKullanicilar.filter(user => user.id !== currentUserId);
      setDigerKullanicilar(digerler);
  
      setPaylasDialogOpen(true);
    } catch (error) {
      console.error("Hata:", error.message);
    }
  };
  
  const handleGorevPaylas = async () => {
    alert("Görev başarıyla paylaşıldı!");
    setPaylasDialogOpen(false);
    try {
        if (secilenKullaniciId && digerKullanicilar.some(user => user.id == secilenKullaniciId)) {
            
            const yeniGorev = { 
                ...mevcutGorev, 
                kullanici: { id: parseInt(secilenKullaniciId) } 
            };

            delete yeniGorev.id;
            const postResponse = await fetch("http://localhost:8080/api/gorev", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(yeniGorev),
            });

            if (!postResponse.ok) {
                alert("Görev başarıyla paylaşıldı!");
                setPaylasDialogOpen(false);
                window.location.reload();
            }
        }
    } catch (error) {
        console.error("Hata:", error.message);
    }
  };

  const handleNotificationClick = () => {
    setBildirimDialogOpen(true);
  };
  
  const handleBildirimDialogClose = () => {
    setBildirimDialogOpen(false);
  };

  const handleGorevDetayOpen = (gorev) => {
    setSelectedGorev(gorev);
    setGorevDetayDialogOpen(true);
  };

  const handleGorevDetayClose = () => {
    setSelectedGorev(null);
    setGorevDetayDialogOpen(false);
  };

  const yaklasanGorevSayisi = gorevler.filter(
    (gorev) =>
      gorev.durum === "Devam Ediyor" &&
      new Date(gorev.bitisTarihi) <= 
      new Date(Date.now() + gorev.uyariSuresi * 24 * 60 * 60 * 1000)
  ).length;
  
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px' }}>
        <IconButton onClick={handleNotificationClick}>
          <Badge
            badgeContent={yaklasanGorevSayisi}
            color="error"
            invisible={yaklasanGorevSayisi === 0}
          >
            <NotificationsIcon sx={{ color: 'white' }} />
          </Badge>
        </IconButton>
        <IconButton onClick={handleClick}>
          <Avatar src="/avatar.jpg" />
        </IconButton>
        <Menu
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleProfileClick()}>Profil</MenuItem>
          <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
        </Menu>
      </div>
      {/* Bildirim Dialogu */}
      <Dialog disableEnforceFocus open={bildirimDialogOpen} onClose={handleBildirimDialogClose}>
      <DialogTitle>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Bildirimler</span>
          </div>
        </DialogTitle>
        <DialogContent>
          {gorevler.filter(gorev =>
            gorev.durum === "Devam Ediyor" && 
            new Date(gorev.bitisTarihi) <= new Date(Date.now() + gorev.uyariSuresi * 24 * 60 * 60 * 1000)
          ).length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Başlık</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Bitiş Tarihi</TableCell>
                  <TableCell style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: '50px' }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gorevler.filter(gorev =>
                  gorev.durum === "Devam Ediyor" && 
                  new Date(gorev.bitisTarihi) <= new Date(Date.now() + gorev.uyariSuresi * 24 * 60 * 60 * 1000)
                ).map((gorev, index) => (
                  <TableRow key={index}>
                    <TableCell>{gorev.baslik}</TableCell>
                    <TableCell>{new Date(gorev.bitisTarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell>
                      <Tooltip title="Görevi Düzenle">
                        <IconButton onClick={() => {
                          setDuzenlemeDurumu(true);
                          duzenlemeyeBasla(gorev.id);
                        }}>
                          <EditIcon sx={{ color: "gray" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Görevi Sil">
                        <IconButton onClick={() => gorevSil(gorev.id)}>
                          <DeleteIcon sx={{ color: "red" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Görev Detayları">
                        <IconButton onClick={() => handleGorevDetayOpen(gorev)}>
                          <InfoIcon sx={{ color: "blue" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Henüz tarihi yaklaşan bir görev yok.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBildirimDialogClose} variant="contained" color="error">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
      {/* Görev detayları için ayrı bir dialog */}
      <Dialog open={gorevDetayDialogOpen} onClose={handleGorevDetayClose}>
        <DialogTitle>Detaylar</DialogTitle>
        <DialogContent>
          {selectedGorev && (
            <div>
              <p><strong>Başlık:</strong> {selectedGorev.baslik}</p>
              <p><strong>Açıklama:</strong> {selectedGorev.aciklama}</p>
              <p><strong>Derecesi:</strong> {selectedGorev.derece}</p>
              <p><strong>Başlangıç Tarihi:</strong> {new Date(selectedGorev.baslangicTarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
              <p><strong>Bitiş Tarihi:</strong> {new Date(selectedGorev.bitisTarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
              <p><strong>Durum:</strong> {selectedGorev.durum}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGorevDetayClose} variant="contained" color="error">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal for Profile */}
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Kullanıcı Bilgileri</DialogTitle>
        {kullanici ? (
          <DialogContent>
            <Typography>Adı: {kullanici.adi}</Typography>
            <Typography>Email: {kullanici.mail}</Typography>
            <div style={{ marginTop: '20px' }}>
              <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditOpen}
                  startIcon={<EditIcon />}
              >
                  Düzenle
              </Button>
              <Button
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                  style={{ marginLeft: '15px' }}
                  startIcon={<DeleteIcon />}
              >
                  Sil
            </Button>
            </div>
          </DialogContent>
        ) : (
          <DialogContent>
            <Typography>Kullanıcı bilgileri yükleniyor...</Typography>
          </DialogContent>
        )}
      </Dialog>
      {/* Şifre Dialog'u */}
      <Dialog open={deleteDialogOpen} onClose={() => { setDeleteDialogOpen(false); setPassword(''); }}>
        <DialogTitle>Hesap Sil</DialogTitle>
        <DialogContent>
          <Typography>Lütfen kullanıcı şifrenizi girin:</Typography>
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            fullWidth
            margin="normal"
          />
          {error && (
            <Typography color="error" style={{ marginTop: '10px' }}>
              Şifre yanlış. Lütfen tekrar deneyin.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => { setDeleteDialogOpen(false); setPassword(''); }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            color="error" 
            onClick={handlePasswordVerification}
            startIcon={<DeleteIcon />} 
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
      {/* Onaylama Dialog'u */}
      <Dialog open={confirmationDialogOpen} onClose={() => setConfirmationDialogOpen(false)}>
        <DialogTitle>Hesap Silme Onayı</DialogTitle>
        <DialogContent>
          <Typography>Tüm görevleriniz kalıcı olarak silinecektir. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setConfirmationDialogOpen(false)}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleKullaniciDelete}
          >
            Evet
          </Button>
        </DialogActions>
      </Dialog>
      {/* Düzenleme Dialog'u */}
      { kullanici ? (
        <Dialog open={editDialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Kullanıcı Bilgilerini Düzenle</DialogTitle>
              <DialogContent>
                  <TextField
                      label="Adı"
                      value={kullanici.adi}
                      onChange={(e) => setKullanici({ ...kullanici, adi: e.target.value })}
                      fullWidth
                      margin="normal"
                  />
                  <TextField
                      label="Email"
                      value={kullanici.mail}
                      onChange={(e) => setKullanici({ ...kullanici, mail: e.target.value })}
                      fullWidth
                      margin="normal"
                  />
                  <Button variant="text" onClick={handleSifreYenileOpen}>
                    Şifre Yenile
                  </Button>
                  <Dialog open={sifreYenileDialogOpen} onClose={handleSifreYenileClose}>
                      <DialogTitle>Şifre Yenile</DialogTitle>
                      <DialogContent>
                          <TextField
                              label="Eski Şifre"
                              type="password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              fullWidth
                              margin="normal"
                          />
                          <TextField
                              label="Yeni Şifre"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              fullWidth
                              margin="normal"
                          />
                          <TextField
                              label="Yeni Şifre Tekrarı"
                              type="password"
                              value={newPasswordRepeat}
                              onChange={(e) => setNewPasswordRepeat(e.target.value)}
                              fullWidth
                              margin="normal"
                          />
                          {error && (
                              <Typography color="error" style={{ marginTop: '10px' }}>
                                  {error}
                              </Typography>
                          )}
                      </DialogContent>
                      <DialogActions>
                          <Button variant="outlined" onClick={handleSifreYenileClose}>
                              İptal
                          </Button>
                          <Button variant="contained" color="success" onClick={handleSifreGuncelle} startIcon={<SaveIcon />}>
                              Kaydet
                          </Button>
                      </DialogActions>
                  </Dialog>
                  {error && (
                      <Typography color="error" style={{ marginTop: '10px' }}>
                          {error}
                      </Typography>
                  )}
              </DialogContent>
              <DialogActions>
                  <Button variant="outlined" onClick={handleDialogClose}>
                      İptal
                  </Button>
                  <Button variant="contained" color="success" onClick={handleKullaniciUpdate} startIcon={<SaveIcon />}>
                      Kaydet
                  </Button>
              </DialogActions>
          </Dialog>
      ) : null }
      <div className="gorev-container">
        <div className="gorev-card">
          <div className="gorev-header">
            <h2>Görevler</h2>
              <div className="gorev-button-group">
                <div className="gorev-filter-buttons">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRemoveFilter}
                  >
                    Filtre Kaldır
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilterClick}
                  >
                    Filtrele
                  </Button>
                </div>
                <div className="gorev-search-field">
                  <TextField
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    label="Ara"
                    variant="outlined"
                    size="small"
                  />
                </div>
                <Button
                  onClick={() => setGorevEklemeGizliMi(true)}
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                >
                  Ekle
                </Button>
              </div>
          </div>
              <Menu
                anchorEl={anchorElMenu2}
                open={Boolean(anchorElMenu2)}
                onClose={() => setAnchorElMenu2(null)}
              >
                <MenuItem onClick={() => { 
                  setFilterType('date');  
                  setOpenFilterModal(true); 
                  handleCloseMenu();
                }}>
                  Tarihe Göre Filtrele
                </MenuItem>
                <MenuItem onClick={() => { 
                  setFilterType('status');  
                  setOpenFilterModal(true); 
                  handleCloseMenu();
                }}>
                  Duruma Göre Filtrele
                </MenuItem>
              </Menu>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <strong>Başlık</strong>
                      <IconButton onClick={() => sortBy('gorevBaslik')}>
                          <Tooltip title="Başlık Sırala">
                            <ArrowDownwardIcon style={{ fontSize: 20, color: 'black' }} />
                          </Tooltip>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <strong>Derece</strong>
                      <IconButton onClick={() => sortBy('derece')}>
                          <Tooltip title="Derece Sırala">
                            <ArrowDownwardIcon style={{ fontSize: 20, color: 'black' }} />
                          </Tooltip>
                      </IconButton>
                    </TableCell>
                    <TableCell><strong>İşlemler</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredGorevler.map((gorev, indeks) => (
                    <React.Fragment key={indeks}>
                      {/* Ana satır */}
                      <TableRow
                        style={{
                          backgroundColor:
                            gorev.durum === 'Tamamlandı' ? '#d3f9d8' :
                            gorev.durum === 'İptal Edildi' ? '#ffcccc' :
                            gorev.durum === 'Devam Ediyor' ? '#ffffff' : 'inherit',
                        }}
                      >
                        <TableCell style={{ display: 'flex', alignItems: 'center' }} colSpan={6}>
                          <IconButton onClick={() => handleRowClick(indeks)}>
                            {expandedRows[indeks] ? '▲' : '▼'}
                          </IconButton>
                          {gorev.gorevBaslik}
                        </TableCell>
                        <TableCell>{gorev.baslik}</TableCell>
                        <TableCell>{gorev.derece}</TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={() => handleCancel(gorev.id)} 
                            disabled={gorev.durum === 'Tamamlandı' || gorev.durum === 'İptal Edildi'}
                          >
                            <Tooltip title="İptal Et">
                              <CloseIcon style={{ color: 'red' }} />
                            </Tooltip>
                          </IconButton>
                          <IconButton 
                            onClick={() => handleComplete(gorev.id)} 
                            disabled={gorev.durum === 'Tamamlandı' || gorev.durum === 'İptal Edildi'}
                          >
                            <Tooltip title="Tamamla">
                              <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
                            </Tooltip>
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={(e) => handleClickMenu(e, indeks)}>
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </IconButton>
                          <Menu
                            anchorEl={anchorElMenu1}
                            open={selectedTaskIndex === indeks}
                            onClose={handleCloseMenu}
                          >
                            {(gorev.durum === 'Tamamlandı' || gorev.durum === 'İptal Edildi') && (
                              <MenuItem onClick={() => handleContinue(gorev.id)}>
                                <IconButton>
                                  <FontAwesomeIcon icon={faUndo} style={{ color: 'gray' }} />
                                </IconButton>
                                Geri Al
                              </MenuItem>
                            )}
                            {(gorev.durum === 'Devam Ediyor') && (
                              <MenuItem onClick={() => duzenlemeyeBasla(gorev.id)}>
                                <IconButton size="small" style={{ marginRight: '6px' }}>
                                  <EditIcon />
                                </IconButton>
                                Düzenle
                              </MenuItem>
                            )}
                            <MenuItem onClick={() => gorevSil(gorev.id)}>
                              <IconButton size="small" style={{ marginRight: '6px' }}>
                                <DeleteIcon />
                              </IconButton>
                              Sil
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleCloseMenu();
                                setSeciliGorev(gorev);
                              }}
                            >
                              <IconButton size="small" style={{ marginRight: '6px' }}>
                                <InfoIcon />
                              </IconButton>
                              Görüntüle
                            </MenuItem>
                            <MenuItem 
                              onClick={() => {
                                handleCloseMenu();
                                handleGonderDialogOpen(gorev.id, kullaniciId);
                                setGonderDialogOpen(true); 
                              }}
                            >
                              <IconButton size="small" style={{ marginRight: '6px' }}>
                                <SendIcon />
                              </IconButton>
                              Gönder
                            </MenuItem>
                            <MenuItem 
                              onClick={() => {
                                handleCloseMenu();
                                handlePaylasDialogOpen(gorev.id, kullaniciId);
                                setPaylasDialogOpen(true);
                              }}
                            >
                              <IconButton size="small" style={{ marginRight: '6px' }}>
                                <ShareIcon />
                              </IconButton>
                              Paylaş
                            </MenuItem>
                          </Menu>
                          <Dialog
                            open={gonderDialogOpen}
                            onClose={() => setGonderDialogOpen(false)}
                            fullWidth
                            maxWidth="sm"
                            inert={gonderDialogOpen ? false : true}
                          >
                            <DialogTitle>Kullanıcı Seç</DialogTitle>
                            <DialogContent>
                              <Box mb={2}>
                              <Typography variant="body1" gutterBottom>
                                Görevi atamak istediğiniz kullanıcıyı seçin:
                              </Typography>
                              <Box mb={2}></Box>
                                {digerKullanicilar.length > 0 ? (
                                  <FormControl fullWidth>
                                    <InputLabel>Kullanıcı</InputLabel>
                                    <Select
                                      value={secilenKullaniciId}
                                      onChange={(e) => setSecilenKullaniciId(e.target.value)}
                                      label="Kullanıcı"
                                    >
                                      {digerKullanicilar.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                          {user.adi} ({user.mail})
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <Typography variant="body2" color="textSecondary">
                                    Diğer kullanıcılar bulunamadı.
                                  </Typography>
                                )}
                              </Box>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                variant="outlined"
                                onClick={() => setGonderDialogOpen(false)}
                              >
                                İptal
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SendIcon />}
                                onClick={handleGorevGuncelle}
                                disabled={!secilenKullaniciId}
                              >
                                Gönder
                              </Button>
                            </DialogActions>
                          </Dialog>
                          <Dialog
                            open={paylasDialogOpen}
                            onClose={() => setPaylasDialogOpen(false)}
                            fullWidth
                            maxWidth="sm"
                            inert={paylasDialogOpen ? false : true}
                          >
                            <DialogTitle>Görevi Paylaş</DialogTitle>
                            <DialogContent>
                              <Box mb={2}>
                                <Typography variant="body1" gutterBottom>
                                  Görevi paylaşmak istediğiniz kullanıcıyı seçin:
                                </Typography>
                                <Box mb={2}></Box>
                                {digerKullanicilar.length > 0 ? (
                                  <FormControl fullWidth>
                                    <InputLabel>Kullanıcı</InputLabel>
                                    <Select
                                      value={secilenKullaniciId}
                                      onChange={(e) => setSecilenKullaniciId(e.target.value)}
                                      label="Kullanıcı"
                                    >
                                      {digerKullanicilar.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                          {user.adi} ({user.mail})
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <Typography variant="body2" color="textSecondary">
                                    Diğer kullanıcılar bulunamadı.
                                  </Typography>
                                )}
                              </Box>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                variant="outlined"
                                onClick={() => setPaylasDialogOpen(false)}
                              >
                                İptal
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ShareIcon />}
                                onClick={handleGorevPaylas}
                                disabled={!secilenKullaniciId}
                              >
                                Paylaş
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </TableCell>
                        <TableCell>
                          {gorev.durum === "Devam Ediyor" &&
                            new Date(gorev.bitisTarihi) <= new Date(Date.now() + gorev.uyariSuresi * 24 * 60 * 60 * 1000) && (
                              <span
                                style={{
                                  color: 'red',
                                  fontWeight: 'bold',
                                  fontSize: '23px',
                                  marginLeft: '5px',
                                  cursor: 'pointer',
                                }}
                                title={
                                  new Date(gorev.bitisTarihi) > new Date()
                                    ? `Son ${Math.ceil((new Date(gorev.bitisTarihi) - new Date()) / (1000 * 60 * 60 * 24))} gün`
                                    : `${Math.abs(Math.ceil((new Date() - new Date(gorev.bitisTarihi)) / (1000 * 60 * 60 * 24) - 1))} gün gecikti`
                                }
                              >
                                !
                              </span>
                            )}
                        </TableCell>
                      </TableRow>
                      {/* Detay satırı */}
                      <TableRow style={{ backgroundColor: '#f9f9f9' }}>
                        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                          <Collapse in={expandedRows[indeks]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                              <Typography variant="h6" gutterBottom component="div">
                                Detay
                              </Typography>
                              <Table size="small" aria-label="details">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Başlangıç Tarihi</TableCell>
                                    <TableCell>Bitiş Tarihi</TableCell>
                                    <TableCell>Açıklama</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                      <TableCell>{gorev.baslangicTarihi}</TableCell>
                                      <TableCell>{gorev.bitisTarihi}</TableCell>
                                      <TableCell>{aciklamayiKisitla(gorev.aciklama)}</TableCell>
                                    </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </div>
      </div>
      {/* Görev Ekleme Modal */}
      {gorevEklemeGizliMi && (
        <div className="gorev-modal-overlay">
          <div className="gorev-modal">
            <h2>Görev Ekle</h2>
            <Box mb={2}>
              <TextField
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                label="Başlık"
                variant="outlined"
                fullWidth
                inputProps={{ maxLength: 250 }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                label="Açıklama"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Derece</InputLabel>
                <Select
                  value={derece}
                  onChange={(e) => setDerece(e.target.value)}
                  label="Derece"
                >
                  {[1, 2, 3, 4, 5].map((dereceDegeri) => (
                    <MenuItem key={dereceDegeri} value={dereceDegeri}>
                      {dereceDegeri}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box mb={2}>
              <TextField
                value={baslangicTarihi}
                onChange={(e) => setBaslangicTarihi(e.target.value)}
                label="Başlangıç Tarihi"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    "& input::-webkit-calendar-picker-indicator": {
                      filter: "invert(100%)", 
                    },
                  },
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                value={bitisTarihi}
                onChange={(e) => setBitisTarihi(e.target.value)}
                label="Bitiş Tarihi"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    "& input::-webkit-calendar-picker-indicator": {
                      filter: "invert(100%)", 
                    },
                  },
                }}
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Tür</InputLabel>
                <Select
                  value={tur}
                  onChange={(e) => setTur(e.target.value)}
                  label="Tur"
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box mb={2}>
              <TextField
                value={uyariSuresi}
                onChange={(e) => setUyariSuresi(e.target.value)}
                label="Uyarı Süresi (Gün)"
                type="number"
                variant="outlined"
                fullWidth
              />
            </Box>
            <div className="gorev-modal-footer">
              <Button onClick={formuSifirla} variant="outlined" >
                İptal
              </Button>
              <Button onClick={gorevEkle} style={{ marginRight: '10px' }} variant="contained" color="success" startIcon={<SaveIcon />}>
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Görev Bilgi Modal */}
      {seciliGorev &&  (
        <div className="gorev-modal-overlay">
          <div className="gorev-modal">
            <h2>Görev Bilgisi</h2>
            <p className="gorev-yazi"><strong>Başlık:</strong> {seciliGorev.baslik}</p>
            <p className="gorev-yazi"><strong>Açıklama:</strong> {seciliGorev.aciklama}</p>
            <p className="gorev-yazi"><strong>Derece:</strong> {seciliGorev.derece}</p>
            <p className="gorev-yazi"><strong>Başlangıç Tarihi:</strong> {seciliGorev.baslangicTarihi}</p>
            <p className="gorev-yazi"><strong>Bitiş Tarihi:</strong> {seciliGorev.bitisTarihi}</p>
            <p className="gorev-yazi"><strong>Tür:</strong> {seciliGorev.tur}</p>
            <p className="gorev-yazi"><strong>Uyarı Süresi (Gün):</strong> {seciliGorev.uyariSuresi}</p>
            <Button onClick={() => setSeciliGorev(null)} variant="contained" color="error" >
              Kapat
            </Button>
          </div>
        </div>
      )}
      {/* Görev Düzenleme Modal */}
      {duzenlemeDurumu && (
        <div className="gorev-modal-overlay" style={{ zIndex: 1500 }}>
          <div className="gorev-modal">
            <h2>Görev Düzenle</h2>
            <Box mb={2}>
              <TextField
                value={baslik}
                onChange={(e) => setBaslik(e.target.value)}
                label="Başlık"
                variant="outlined"
                fullWidth
                inputProps={{ maxLength: 250 }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                label="Açıklama"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Derece </InputLabel>
                <Select
                  value={derece}
                  onChange={(e) => setDerece(e.target.value)}
                  label="Derece "
                >
                  {[1, 2, 3, 4, 5].map((dereceDegeri) => (
                    <MenuItem key={dereceDegeri} value={dereceDegeri}>
                      {dereceDegeri}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box mb={2}>
              <TextField
                value={baslangicTarihi}
                onChange={(e) => setBaslangicTarihi(e.target.value)}
                label="Başlangıç Tarihi"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    "& input::-webkit-calendar-picker-indicator": {
                      filter: "invert(100%)", 
                    },
                  },
                }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                value={bitisTarihi}
                onChange={(e) => setBitisTarihi(e.target.value)}
                label="Bitiş Tarihi"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    "& input::-webkit-calendar-picker-indicator": {
                      filter: "invert(100%)", 
                    },
                  },
                }}
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Tür</InputLabel>
                <Select
                  value={tur}
                  onChange={(e) => setTur(e.target.value)}
                  label="Tur"
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box mb={2}>
              <TextField
                value={uyariSuresi}
                onChange={(e) => setUyariSuresi(e.target.value)}
                label="Uyarı Süresi (Gün)"
                type="number"
                variant="outlined"
                fullWidth
              />
            </Box>
            <div className="gorev-modal-footer">
              <Button onClick={() => {
                setDuzenlemeDurumu(false);
                formuSifirla();
              }} variant="outlined" >
                İptal
              </Button>
              <Button onClick={duzenlemeyiKaydet} style={{ marginRight: '10px' }} variant="contained" color="success" startIcon={<SaveIcon />}>
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Tarih Filtreleme Modal */}
      {openFilterModal && filterType === 'date' && (
        <div className="gorev-modal-overlay">
          <div className="gorev-modal">
            <h2>Tarih Aralık İçi Filtrele</h2>
            <Box mb={2}>
              <TextField
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                label="Tarih Seç"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    "& input::-webkit-calendar-picker-indicator": {
                      filter: "invert(100%)", 
                    },
                  },
                }}
              />
              </Box>
                <div className="gorev-modal-footer">
                  <Button onClick={handleFilterModalClose} variant="outlined">
                    İptal
                  </Button>
                  <Button onClick={handleApplyFilter} variant="contained" style={{ marginRight: '10px' }}>
                    Uygula
                  </Button>
                </div>
            </div>
          </div>
      )}

      {/* Durum filtresi modalı */}
      {openFilterModal && filterType === 'status' && (
        <div className="gorev-modal-overlay">
          <div className="gorev-modal">
            <h2>Duruma Göre Filtrele</h2>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Durum Seç</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Durum Seç"
                >
                  <MenuItem value="Devam Ediyor">Devam Ediyor</MenuItem>
                  <MenuItem value="Tamamlandı">Tamamlandı</MenuItem>
                  <MenuItem value="İptal Edildi">İptal Edildi</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <div className="gorev-modal-footer">
              <Button onClick={handleFilterModalClose} variant="outlined">
                İptal
              </Button>
              <Button onClick={handleApplyFilter} variant="contained" style={{ marginRight: '10px' }}>
                Uygula
              </Button>
            </div>
          </div>
        </div>
      )}
  </div>
  );
}

export default Gorev;