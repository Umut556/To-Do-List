package com.example.api.kullanici.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.api.kullanici.entity.Kullanici;
import com.example.api.kullanici.service.KullaniciService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/kullanici")
public class KullaniciController {

    @Autowired
    private final KullaniciService kullaniciService;

    public KullaniciController(KullaniciService kullaniciService) {
        this.kullaniciService = kullaniciService;
    }

    // Tüm kullanıcıları listeleme
    @GetMapping
    public List<Kullanici> getAllKullanicilar() {
        return kullaniciService.getAllKullanicilar();
    }

    // ID'ye göre kullanıcı getirme
    @GetMapping("/{id}")
    public Kullanici getKullaniciById(@PathVariable Integer id) {
        return kullaniciService.getKullaniciById(id);
    }

    // Yeni kullanıcı oluşturma
    @PostMapping
    public Kullanici createKullanici(@RequestBody Kullanici kullanici) {
        return kullaniciService.createKullanici(kullanici);
    }

    // Kullanıcı güncelleme
    @PutMapping("/{id}")
    public Kullanici updateKullanici(@PathVariable Integer id, @RequestBody Kullanici kullanici) {
        kullanici.setId(id); 
        return kullaniciService.updateKullanici(id, kullanici);
    }

    // Görev silme
    @DeleteMapping("/{id}")
    public void deleteKullanici(@PathVariable Integer id) {
        kullaniciService.deleteKullanici(id);
    }

    // Ada göre kullanıcı getirme
    @GetMapping("/adi/{adi}")
    public List<Kullanici> getKullanicilarByAdi(@PathVariable String adi) {
        return kullaniciService.getKullanicilarByAdi(adi);
    }
    

}
