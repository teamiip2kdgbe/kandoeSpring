package be.kdg.kandoe.frontend.controllers.rest;

import be.kdg.kandoe.backend.dom.game.Card;
import be.kdg.kandoe.backend.dom.game.CircleSession.Session;
import be.kdg.kandoe.backend.dom.game.Message;
import be.kdg.kandoe.backend.dom.users.User;
import be.kdg.kandoe.backend.services.api.SessionService;
import be.kdg.kandoe.backend.services.exceptions.SessionServiceException;
import be.kdg.kandoe.frontend.DTO.CardDTO;
import be.kdg.kandoe.frontend.DTO.SessionDTO;
import be.kdg.kandoe.frontend.assemblers.SessionAssembler;
import be.kdg.kandoe.frontend.webSocket.CurrentMove;
import be.kdg.kandoe.frontend.webSocket.Greeting;
import be.kdg.kandoe.frontend.webSocket.NextMove;
import ma.glasnost.orika.MapperFacade;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by amy on 7/03/2016.
 */

@RestController
@RequestMapping(value = "/api/sessions")
public class SessionRestController {
    private final Logger logger = Logger.getLogger(CardRestController.class);
    private final SessionService sessionService;
    private final SessionAssembler sessionAssembler;
    private final MapperFacade mapper;

    @Autowired
    public SessionRestController(SessionService sessionService, SessionAssembler sessionAssembler, MapperFacade mapper) {
        this.sessionService = sessionService;
        this.sessionAssembler = sessionAssembler;
        this.mapper = mapper;
    }

    @RequestMapping(method = {RequestMethod.GET}, value = "/{sessionId}")
    public ResponseEntity<SessionDTO> getSessionById(@PathVariable("sessionId") int sessionId, @AuthenticationPrincipal User user){
        if(user != null){
            try {
                Session session = this.sessionService.findSessionById(sessionId, user.getUserId());
                SessionDTO dto = sessionAssembler.toResource(session);

                if(session.getTheme() == null) {
                    if (session.getSubTheme().getOrganisation().getOrganisers().stream().anyMatch(o -> o.getId().equals(user.getId()))) {
                        dto.setIsOrganiser(true);
                    }
                } else if (session.getTheme().getOrganisation().getOrganisers().stream().anyMatch(o -> o.getId().equals(user.getId()))) {
                    dto.setIsOrganiser(true);
                }

                session.getUserSessions().stream().filter(us -> us.getUser().getId().equals(user.getId()))
                        .findFirst().ifPresent(userSession ->  dto.setChosenCards(userSession.isChosenCards()));

                return new ResponseEntity<>(dto, HttpStatus.OK);
            } catch (SessionServiceException e) {
                return new ResponseEntity<SessionDTO>(HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<SessionDTO>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value = "/currentUser" ,method = RequestMethod.GET)
    public ResponseEntity<List<SessionDTO>> getSessionsCurrentUser(@AuthenticationPrincipal User user){
        if(user != null){
            try {
                List<Session> sessions = this.sessionService.findSessionsCurrentUser(user.getUserId());
                List<SessionDTO> sessionDTOs = new ArrayList<>();

                for(Session session : sessions) {
                    SessionDTO dto = sessionAssembler.toResource(session);
                    session.getUserSessions().stream().filter(us -> us.getUser().getId().equals(user.getId()))
                            .findFirst().ifPresent(userSession -> dto.setChosenCards(userSession.isChosenCards()));
                    sessionDTOs.add(dto);
                }

                return new ResponseEntity<List<SessionDTO>>(sessionDTOs, HttpStatus.OK);
            } catch (SessionServiceException e) {
                return new ResponseEntity<List<SessionDTO>>(HttpStatus.BAD_REQUEST);
            }
        }

        return new ResponseEntity<List<SessionDTO>>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(method = {RequestMethod.GET}, value = "/theme/{themeId}")
    public ResponseEntity<List<SessionDTO>> getSessionByThemeId(@PathVariable("themeId") int themeId, @AuthenticationPrincipal User user){
        if (user != null){
            try{
                List<Session> sessions = this.sessionService.findSessionsByThemeId(themeId, user.getUserId());
                return new ResponseEntity<List<SessionDTO>>(sessionAssembler.toResources(sessions), HttpStatus.OK);
            } catch (SessionServiceException e) {
                return new ResponseEntity<List<SessionDTO>>(HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<List<SessionDTO>>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(method = {RequestMethod.GET}, value = "/subtheme/{subThemeId}")
    public ResponseEntity<List<SessionDTO>> getSessionsBySubThemeId(@PathVariable("subThemeId") int subThemeId, @AuthenticationPrincipal User user){
        if (user != null){
            try {
                List<Session> sessions = this.sessionService.findSessionsBySubThemeId(subThemeId, user.getUserId());
                return new ResponseEntity<List<SessionDTO>>(sessionAssembler.toResources(sessions), HttpStatus.OK);
            } catch (SessionServiceException e){
                return new ResponseEntity<List<SessionDTO>>(HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<List<SessionDTO>>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<SessionDTO> createSession(@RequestBody SessionDTO sessionDTO, @AuthenticationPrincipal User user){
        if(user != null){
            try {
                Session session_in = mapper.map(sessionDTO, Session.class);
                Session session_out;
                if (sessionDTO.getThemeId() == null){
                    session_out = sessionService.createSession(session_in, 0,sessionDTO.getSubThemeId() , user.getId());
                } else {
                    session_out = sessionService.createSession(session_in, sessionDTO.getThemeId(),0 , user.getId());
                }

                return new ResponseEntity<SessionDTO>(sessionAssembler.toResource(session_out), HttpStatus.CREATED);
            } catch (SessionServiceException e) {
                return new ResponseEntity<SessionDTO>(HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<SessionDTO>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value = "/{sessionId}/addCards", method = RequestMethod.POST)
    public ResponseEntity<SessionDTO> addCardsToSession(@RequestBody List<CardDTO> cardDTOs,
                                                        @PathVariable("sessionId") Integer sessionId,
                                                        @AuthenticationPrincipal User user) {
        if(user != null){
            try {
                List<Card> cards = new ArrayList<>();
                for (CardDTO cardDTO : cardDTOs) {
                    cards.add(mapper.map(cardDTO, Card.class));
                }

                Session session = sessionService.addCardsToSession(sessionId, cards, user.getId());
                return new ResponseEntity<SessionDTO>(sessionAssembler.toResource(session), HttpStatus.OK);
            } catch (SessionServiceException e) {
                return new ResponseEntity<SessionDTO>(HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<SessionDTO>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value = "/{sessionId}/start", method = RequestMethod.POST)
    public ResponseEntity<SessionDTO> startSession(@PathVariable("sessionId") Integer sessionId,
                                                   @AuthenticationPrincipal User user){
        if(user != null){
            try {
                Session s = sessionService.startSession(sessionId, user.getId());
                return new ResponseEntity<SessionDTO>(sessionAssembler.toResource(s), HttpStatus.OK);
            } catch (SessionServiceException e) {
                return new ResponseEntity<SessionDTO>(HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<SessionDTO>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value = "/{sessionId}/stop", method = RequestMethod.POST)
    public ResponseEntity<SessionDTO> stopSession(@PathVariable("sessionId") Integer sessionId,
                                                   @AuthenticationPrincipal User user){
        if(user != null){
            try {
                Session s = sessionService.stopSession(sessionId, user.getId());
                return new ResponseEntity<SessionDTO>(sessionAssembler.toResource(s), HttpStatus.OK);
            } catch (SessionServiceException e) {
                return new ResponseEntity<SessionDTO>(HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<SessionDTO>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value = "/{sessionId}/chat")
    public ResponseEntity<List<Greeting>> getChatHistory(@PathVariable("sessionId") Integer sessionId,
                                                         @AuthenticationPrincipal User user) throws SessionServiceException {
        if(user != null) {
            List<Message> messages = sessionService.getChatHistory(sessionId, user.getUserId());
            List<Greeting> greetings = messages.stream().map(m -> new Greeting(m.getSender().getUsername(), m.getContent(),
                    String.valueOf(m.getDate().getHour() + ":" + m.getDate().getMinute()),
                    m.getSender().getProfilePicture(), sessionId)).collect(Collectors.toList());
            return new ResponseEntity<List<Greeting>>(greetings, HttpStatus.OK);

        }
        return new ResponseEntity<List<Greeting>>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value = "/{sessionId}/canPlay")
    public ResponseEntity<Boolean> checkCanPlay(@PathVariable("sessionId") Integer sessionId,
                                                @AuthenticationPrincipal User user) {

        if(user != null){
            boolean canPlay = sessionService.checkCanPlay(sessionId, user.getId());
            return new ResponseEntity<Boolean>(canPlay, HttpStatus.OK);
        }
        return new ResponseEntity<Boolean>(HttpStatus.UNAUTHORIZED);
    }

    @RequestMapping(value = "/makeMove", method = RequestMethod.POST)
    public ResponseEntity<SessionDTO> makeMove(@RequestBody CurrentMove move, @AuthenticationPrincipal User user)
            throws SessionServiceException {
        if(user!=null) {
            sessionService.updateCardPosition(move.getCardId(), user.getUserId(), move.getSessionId());
            Session ses= sessionService.findSessionById(move.getSessionId(), user.getUserId());
            return new ResponseEntity<SessionDTO>(sessionAssembler.toResource(ses), HttpStatus.CREATED);

        }
        return new ResponseEntity<SessionDTO>(HttpStatus.UNAUTHORIZED);
    }
}
