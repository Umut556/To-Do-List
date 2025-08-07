package com.example.api.gorev.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.api.gorev.entity.Gorev;

@Repository
public interface GorevRepository extends JpaRepository<Gorev, Integer> {

    // Başlığa göre görevleri bulma
    List<Gorev> findByBaslikContainingIgnoreCase(String baslik);

    // Duruma göre görevleri bulma
    List<Gorev> findByDurum(String durum);

    // Başlangıç tarihi ile bitiş tarihi arasında olan görevleri bulma
    @Query("SELECT g FROM Gorev g WHERE :date BETWEEN g.baslangicTarihi AND g.bitisTarihi")
    List<Gorev> findByDateBetween(@Param("date") LocalDate date);

    // Türe göre görevleri bulma
    List<Gorev> findByTur(String tur);

    // Kullanıcı ID'ye göre görev listesini bulma
    List<Gorev> findByKullaniciId(Integer kullaniciId);


}
