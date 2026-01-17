package comite.demo.repository;

import comite.demo.entity.ProtocolFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProtocolFileRepository extends JpaRepository<ProtocolFile, Long> {
    List<ProtocolFile> findByProtocolId(Long protocolId);
    List<ProtocolFile> findByProtocolIdAndFileType(Long protocolId, ProtocolFile.FileType fileType);
}