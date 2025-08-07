package com.example.api.gorev.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.api.comman.GeneralException;
import com.example.api.gorev.entity.Gorev;
import com.example.api.gorev.repository.GorevRepository;


@Service
public class GorevService {

    @Autowired
    private final GorevRepository gorevRepository;

    public GorevService(GorevRepository gorevRepository) {
        this.gorevRepository = gorevRepository;
    }

    // Yeni görev oluşturma
    public Gorev createGorev(Gorev gorev) {
        return gorevRepository.save(gorev);
    }
    
    // Tüm görevleri listeleme
    public List<Gorev> getAllGorevler() {
        return gorevRepository.findAll();
    }

    // ID'ye göre görev getirme
    public Gorev getGorevById(Integer id) {
        return gorevRepository.findById(id)
                .orElseThrow(() -> new GeneralException("Görev bulunamadi: " + id));
    }

    // Görev güncelleme
    public Gorev updateGorev(Integer id, Gorev updatedGorev) {
        Gorev existingGorev = gorevRepository.findById(id)
                .orElseThrow(() -> new GeneralException("Güncellenecek görev bulunamadı: " + id));

        existingGorev.setBaslik(updatedGorev.getBaslik());
        existingGorev.setAciklama(updatedGorev.getAciklama());
        existingGorev.setDerece(updatedGorev.getDerece());
        existingGorev.setBaslangicTarihi(updatedGorev.getBaslangicTarihi());
        existingGorev.setBitisTarihi(updatedGorev.getBitisTarihi());
        existingGorev.setDurum(updatedGorev.getDurum());
        existingGorev.setKullanici(updatedGorev.getKullanici());
        existingGorev.setTur(updatedGorev.getTur());
        existingGorev.setUyariSuresi(updatedGorev.getUyariSuresi());

        return gorevRepository.save(existingGorev);
    }

    // Görev silme
    public void deleteGorev(Integer id) {
        if (!gorevRepository.existsById(id)) {
            throw new GeneralException("Silinecek görev bulunamadı: " + id);
        }
        gorevRepository.deleteById(id);
    }

    // Duruma göre görevleri filtreleme
    public List<Gorev> getGorevByDurum(String durum) {
        return gorevRepository.findByDurum(durum);
    }

    // Başlığa göre görevleri arama
    public List<Gorev> searchGorevlerByBaslik(String baslik) {
        return gorevRepository.findByBaslikContainingIgnoreCase(baslik);
    }

    // Tarihe göre arama
    public List<Gorev> getGorevlerByDate(LocalDate date) {
        return gorevRepository.findByDateBetween(date);
    }

    // Türe göre görevleri bulma
    public List<Gorev> getGorevByTur(String tur) {
        return gorevRepository.findByTur(tur);
    }

    // Kullanıcı ID'ye göre görev getirme
    public List<Gorev> getGorevByKullaniciId(Integer kullaniciId) {
        return gorevRepository.findByKullaniciId(kullaniciId);
    }
    
}

