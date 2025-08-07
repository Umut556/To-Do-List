package com.example.api.gorev.entity;

import java.time.LocalDate;

import com.example.api.kullanici.entity.Kullanici;

import jakarta.persistence.*;

@Entity 
public class Gorev {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String baslik;

    @Column
    private String aciklama;

    @Column 
    private Integer derece;

    @Column (name = "baslangic_tarihi")
    private LocalDate baslangicTarihi;

    @Column (name = "bitis_tarihi")
    private LocalDate bitisTarihi;

    @Column 
    private String durum;

    @ManyToOne
    @JoinColumn(name = "kullanici_id", referencedColumnName = "id")
    private Kullanici kullanici;

    @Column 
    private String tur = "public";

    @Column (name = "uyari_suresi")
    private Integer uyariSuresi;

    // Getter ve Setter'lar
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBaslik() {
        return baslik;
    }

    public void setBaslik(String baslik) {
        this.baslik = baslik;
    }

    public String getAciklama() {
        return aciklama;
    }

    public void setAciklama(String aciklama) {
        this.aciklama = aciklama;
    }

    public Integer getDerece() {
        return derece;
    }

    public void setDerece(Integer derece) {
        this.derece = derece;
    }

    public LocalDate getBaslangicTarihi() {
        return baslangicTarihi;
    }

    public void setBaslangicTarihi(LocalDate baslangicTarihi) {
        this.baslangicTarihi = baslangicTarihi;
    }

    public LocalDate getBitisTarihi() {
        return bitisTarihi;
    }

    public void setBitisTarihi(LocalDate bitisTarihi) {
        this.bitisTarihi = bitisTarihi;
    }

    public String getDurum() {
        return durum;
    }

    public void setDurum(String durum) {
        this.durum = durum;
    }

    public Kullanici getKullanici() {
        return kullanici;
    }

    public void setKullanici(Kullanici kullanici) {
        this.kullanici = kullanici;
    }

    public String getTur() {
        return tur;
    }

    public void setTur(String tur) {
        this.tur = tur;
    }

    public Integer getUyariSuresi() {
        return uyariSuresi;
    }

    public void setUyariSuresi(Integer uyariSuresi) {
        this.uyariSuresi = uyariSuresi;
    }
    
}
