package com.aswaqbank.repository;

import com.aswaqbank.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByUser_Id(Long userId);

    Optional<Beneficiary> findByIdAndUser_Id(Long id, Long userId);
}