package be.kdg.kandoe.frontend.config.security;

import be.kdg.kandoe.backend.dom.users.User;
import be.kdg.kandoe.backend.persistence.api.UserRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * Created by Jordan on 13/02/2016.
 */
@Component
public class UserDetailServiceImpl implements UserDetailsService {
    private final UserRespository userRepo;

    @Autowired
    public UserDetailServiceImpl(UserRespository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        User user = userRepo.findUserByUserName(username);
        if (user == null) {
            throw new UsernameNotFoundException("Could not find user " + username);
        }
        return user;
    }
}
