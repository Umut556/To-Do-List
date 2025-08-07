package com.example.api.kullanici.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import com.example.api.comman.GeneralException;
import com.example.api.kullanici.entity.Kullanici;
import com.example.api.kullanici.repository.KullaniciRepository;

@Service
public class KullaniciService {
    @Autowired
    private final KullaniciRepository kullaniciRepository;

    public KullaniciService(KullaniciRepository kullaniciRepository) {
        this.kullaniciRepository = kullaniciRepository;
    }

    // Yeni kullanıcı oluşturma
    public Kullanici createKullanici(Kullanici kullanici) {
        return kullaniciRepository.save(kullanici);
    }
    
    // Tüm kullanıcıları listeleme
    public List<Kullanici> getAllKullanicilar() {
        return kullaniciRepository.findAll();
    }

    // ID'ye göre kullanıcı getirme
    public Kullanici getKullaniciById(Integer id) {
        return kullaniciRepository.findById(id)
                .orElseThrow(() -> new GeneralException("Kullanıcı bulunamadi: " + id));
    }

    // Kullanıcı güncelleme
    public Kullanici updateKullanici(Integer id, Kullanici updatedKullanici) {
        Kullanici existingKullanici = kullaniciRepository.findById(id)
                .orElseThrow(() -> new GeneralException("Güncellenecek kullanıcı bulunamadı: " + id));

        existingKullanici.setAdi(updatedKullanici.getAdi());
        existingKullanici.setSifre(updatedKullanici.getSifre());
        existingKullanici.setMail(updatedKullanici.getMail());

        return kullaniciRepository.save(existingKullanici);
    }

    // Görev silme
    public void deleteKullanici(Integer id) {
        if (!kullaniciRepository.existsById(id)) {
            throw new GeneralException("Silinecek kullanıcı bulunamadı: " + id);
        }
        kullaniciRepository.deleteById(id);
    }

    // Ada göre kullanıcı getirme
    public List<Kullanici> getKullanicilarByAdi(String adi) {
        return kullaniciRepository.findByAdi(adi);
}
}
