package co.com.fitel.modules.channels.infrastructure.repository;

import co.com.fitel.modules.channels.domain.model.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Long> {
    
    Optional<Channel> findByNumber(Integer number);
    
    List<Channel> findByActiveTrueOrderByNumberAsc();
    
    List<Channel> findAllByOrderByNumberAsc();
    
    boolean existsByNumber(Integer number);
    
    boolean existsByNumberAndIdNot(Integer number, Long id);
}
