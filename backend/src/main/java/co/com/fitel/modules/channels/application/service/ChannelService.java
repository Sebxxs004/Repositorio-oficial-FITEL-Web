package co.com.fitel.modules.channels.application.service;

import co.com.fitel.common.exception.BusinessException;
import co.com.fitel.modules.channels.domain.model.Channel;
import co.com.fitel.modules.channels.infrastructure.repository.ChannelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChannelService {

    private final ChannelRepository channelRepository;

    @Transactional(readOnly = true)
    public List<Channel> getAllChannels() {
        return channelRepository.findAllByOrderByNumberAsc();
    }

    @Transactional(readOnly = true)
    public List<Channel> getActiveChannels() {
        return channelRepository.findByActiveTrueOrderByNumberAsc();
    }

    @Transactional(readOnly = true)
    public Channel getChannelById(Long id) {
        return channelRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Canal no encontrado con ID: " + id, HttpStatus.NOT_FOUND));
    }

    @Transactional
    public Channel createChannel(Channel channel) {
        if (channelRepository.existsByNumber(channel.getNumber())) {
            throw new BusinessException("Ya existe un canal con el número " + channel.getNumber(), HttpStatus.BAD_REQUEST);
        }
        return channelRepository.save(channel);
    }

    @Transactional
    public Channel updateChannel(Long id, Channel channelDetails) {
        Channel channel = getChannelById(id);

        if (channelRepository.existsByNumberAndIdNot(channelDetails.getNumber(), id)) {
            throw new BusinessException("Ya existe un canal con el número " + channelDetails.getNumber(), HttpStatus.BAD_REQUEST);
        }

        channel.setName(channelDetails.getName());
        channel.setNumber(channelDetails.getNumber());
        channel.setCategory(channelDetails.getCategory());
        channel.setLogoUrl(channelDetails.getLogoUrl());
        channel.setDescription(channelDetails.getDescription());
        channel.setActive(channelDetails.getActive());

        return channelRepository.save(channel);
    }

    @Transactional
    public void deleteChannel(Long id) {
        Channel channel = getChannelById(id);
        channelRepository.delete(channel);
    }

    @Transactional
    public Channel toggleActive(Long id) {
        Channel channel = getChannelById(id);
        channel.setActive(!channel.getActive());
        return channelRepository.save(channel);
    }
}
