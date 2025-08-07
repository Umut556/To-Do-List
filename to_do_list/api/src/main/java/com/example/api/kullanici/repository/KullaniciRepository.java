package com.example.api.kullanici.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.api.kullanici.entity.Kullanici;

@Repository
public interface KullaniciRepository extends JpaRepository<Kullanici, Integer> {
    List<Kullanici> findByAdi(String adi);
}
