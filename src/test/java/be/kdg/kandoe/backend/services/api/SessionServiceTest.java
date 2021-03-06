package be.kdg.kandoe.backend.services.api;

import be.kdg.kandoe.backend.config.BackendContextConfig;
import be.kdg.kandoe.backend.dom.game.Card;
import be.kdg.kandoe.backend.dom.game.CircleSession.CardSession;
import be.kdg.kandoe.backend.dom.game.CircleSession.Session;
import be.kdg.kandoe.backend.dom.game.CircleSession.UserSession;
import be.kdg.kandoe.backend.services.exceptions.SessionServiceException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import javax.transaction.Transactional;
import javax.validation.constraints.AssertFalse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by Jordan on 11/03/2016.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = BackendContextConfig.class)
@TransactionConfiguration(defaultRollback = true)
@Transactional
public class SessionServiceTest {

    @Autowired
    SessionService sessionService;

    @Before
    public void setup() throws Exception {
        List<Card> cards = new ArrayList<>();
        Card card1 = new Card();
        card1.setCardId(1);
        Card card2 = new Card();
        card2.setCardId(2);
        Card card3 = new Card();
        card3.setCardId(3);
        cards.add(card1);
        cards.add(card2);
        cards.add(card3);
        sessionService.addCardsToSession(1, cards, 1);
    }

    @Test
    public void testMoveCard() throws Exception {
        Session s = sessionService.findSessionById(1,1);
        sessionService.startSession(s.getSessionId(), 1);

        CardSession cardSession = s.getCardSessions().stream().filter(cs -> cs.getPosition()==0).findFirst().get();
        UserSession userSession = s.getUserSessions().stream().filter(us -> us.getUserPosition()==0).findFirst().get();
        int original = cardSession.getPosition();

        sessionService.updateCardPosition(cardSession.getCard().getId(),userSession.getUser().getId(),s.getId());
        assertEquals("The cardPosition should be 1",original+1,cardSession.getPosition());
        assertEquals("The UserPosition should have been updated",s.getUserSessions().size()-1,userSession.getUserPosition());
    }

    @Test
    public void testMoveCardWrongUser() throws Exception{
        Session s = sessionService.findSessionById(1,1);
        sessionService.startSession(s.getSessionId(), 1);

        CardSession cardSession = s.getCardSessions().stream().filter(cs -> cs.getPosition()==0).findFirst().get();
        UserSession userSession = s.getUserSessions().stream().filter(us -> us.getUserPosition()==1).findFirst().get();

        int original = cardSession.getPosition();
        sessionService.updateCardPosition(cardSession.getCard().getId(),userSession.getUser().getId(),s.getId());
        assertEquals("The cardPosition should be 0",original,cardSession.getPosition());
    }

    @Test
    public void testAddMessageToSession() throws Exception {
        Session s = sessionService.findSessionById(1,1);
        int chatSize = s.getChat().size();

        s = sessionService.addMessageToChat(s.getSessionId(), "testtesttest", 1, LocalDateTime.now());
        assertEquals("The message should have been added to the chat", chatSize+1, s.getChat().size());
    }

    @Test(expected = SessionServiceException.class)
    public void testAddMessageToWrongSession() throws Exception {
        sessionService.addMessageToChat(-1, "testtesttest", 1, LocalDateTime.now());
    }
}
