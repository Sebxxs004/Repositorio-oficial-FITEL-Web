package co.com.fitel.modules.channels.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.channels.application.service.ChannelService;
import co.com.fitel.modules.channels.domain.model.Channel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class ChannelController {

    private final ChannelService channelService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Channel>>> getActiveChannels() {
        return ResponseEntity.ok(ApiResponse.success(channelService.getActiveChannels()));
    }
}
