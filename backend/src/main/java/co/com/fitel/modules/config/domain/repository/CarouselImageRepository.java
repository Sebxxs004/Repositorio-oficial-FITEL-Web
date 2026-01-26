package co.com.fitel.modules.config.domain.repository;

import co.com.fitel.modules.config.domain.model.CarouselImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarouselImageRepository extends JpaRepository<CarouselImage, Long> {
    List<CarouselImage> findByIsActiveTrueOrderByOrderIndexAsc();
    List<CarouselImage> findAllByOrderByOrderIndexAsc();
}
