package com.example.api.gorev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.example.api.gorev.entity.Gorev;
import com.example.api.gorev.service.GorevService;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/gorev")
public class GorevController {

    @Autowired
    private final GorevService gorevService;

    public GorevController(GorevService gorevService) {
        this.gorevService = gorevService;
    }

    // Tüm görevleri listeleme
    @GetMapping
    public List<Gorev> getAllGorevler() {
        return gorevService.getAllGorevler();
    }

    // ID'ye göre görev getirme
    @GetMapping("/{id}")
    public Gorev getGorevById(@PathVariable Integer id) {
        return gorevService.getGorevById(id);
    }

    // Yeni görev oluşturma
    @PostMapping
    public Gorev createGorev(@RequestBody Gorev gorev) {
        return gorevService.createGorev(gorev);
    }

    // Görev güncelleme
    @PutMapping("/{id}")
    public Gorev updateGorev(@PathVariable Integer id, @RequestBody Gorev gorev) {
        gorev.setId(id); 
        return gorevService.updateGorev(id, gorev);
    }

    // Görev silme
    @DeleteMapping("/{id}")
    public void deleteGorev(@PathVariable Integer id) {
        gorevService.deleteGorev(id);
    }

    // Duruma göre görevleri filtreleme
    @GetMapping("/durum/{durum}")
    public List<Gorev> getGorevByDurum(@PathVariable("durum") String durum) {
        System.out.println(durum);
        return gorevService.getGorevByDurum(durum);
    }

    // Başlığa göre görevleri arama
    @GetMapping("/baslik/{baslik}")
    public List<Gorev> searchGorevler(@PathVariable("baslik") String baslik) {
        return gorevService.searchGorevlerByBaslik(baslik);
    }

    // Tarihe göre arama
    @GetMapping("/tarih/{tarih}")
    public List<Gorev> getGorevlerByDate(@PathVariable("tarih") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tarih) {
        //System.out.println(tarih);
        return gorevService.getGorevlerByDate(tarih);
    }

    // Türe göre görevleri bulma
    @GetMapping("/tur/{tur}")
    public List<Gorev> getGorevByTur(@PathVariable("tur") String tur) {
        return gorevService.getGorevByTur(tur);
    }

    // Kullanıcı ID'ye göre görev getirme
    @GetMapping("/kullaniciId/{kullaniciId}")
    public List<Gorev> getGorevByKullaniciId(@PathVariable Integer kullaniciId) {
        return gorevService.getGorevByKullaniciId(kullaniciId);
    }

}
