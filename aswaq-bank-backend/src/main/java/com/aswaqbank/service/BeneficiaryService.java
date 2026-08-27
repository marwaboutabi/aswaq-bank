package com.aswaqbank.service;

import com.aswaqbank.entity.Beneficiary;
import com.aswaqbank.entity.User;
import com.aswaqbank.repository.BeneficiaryRepository;
import com.aswaqbank.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository repository;
    private final UserRepository userRepository;

    public BeneficiaryService(BeneficiaryRepository repository, UserRepository userRepository){
        this.repository = repository;
        this.userRepository = userRepository;
    }

    private User getUserConnecte(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public List<Beneficiary> getAll(String email){
        User user = getUserConnecte(email);
        return repository.findByUser_Id(user.getId());
    }

    public Beneficiary save(Beneficiary beneficiary, String email){

        if(!beneficiary.getRib().matches("\\d{24}")){
            throw new RuntimeException("RIB invalide");
        }

        User user = getUserConnecte(email);
        beneficiary.setUser(user);

        return repository.save(beneficiary);
    }

    public Beneficiary update(Long id, Beneficiary data, String email){

        User user = getUserConnecte(email);

        Beneficiary existing = repository.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Bénéficiaire introuvable"));

        existing.setName(data.getName());
        existing.setType(data.getType());
        existing.setBank(data.getBank());
        existing.setCountry(data.getCountry());
        existing.setRib(data.getRib());
        existing.setAlias(data.getAlias());
        existing.setPhone(data.getPhone());

        return repository.save(existing);
    }

    public void delete(Long id, String email){
        User user = getUserConnecte(email);

        Beneficiary existing = repository.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Bénéficiaire introuvable"));

        repository.delete(existing);
    }
}