package co.com.fitel.modules.channels.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.channels.application.service.ChannelService;
import co.com.fitel.modules.channels.domain.model.Channel;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import co.com.fitel.common.service.FileStorageService;

@RestController
@RequestMapping("/api/admin/channels")
@RequiredArgsConstructor
public class ChannelAdminController {

    private final ChannelService channelService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Channel>>> getAllChannels() {
        return ResponseEntity.ok(ApiResponse.success(channelService.getAllChannels()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Channel>> createChannel(@Valid @RequestBody Channel channel) {
        return ResponseEntity.ok(ApiResponse.success(
                "Canal creado exitosamente",
                channelService.createChannel(channel)
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Channel>> updateChannel(
            @PathVariable Long id,
            @Valid @RequestBody Channel channel) {
        return ResponseEntity.ok(ApiResponse.success(
                "Canal actualizado exitosamente",
                channelService.updateChannel(id, channel)
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChannel(@PathVariable Long id) {
        channelService.deleteChannel(id);
        return ResponseEntity.ok(ApiResponse.success("Canal eliminado exitosamente", null));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Channel>> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                "Estado del canal actualizado",
                channelService.toggleActive(id)
        ));
    }

    @PostMapping("/upload-logo")
    public ResponseEntity<ApiResponse<String>> uploadLogo(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(ApiResponse.success("Logo subido exitosamente", fileUrl));
    }
}
