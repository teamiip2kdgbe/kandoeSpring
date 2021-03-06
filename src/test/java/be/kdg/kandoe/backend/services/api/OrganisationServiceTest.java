package be.kdg.kandoe.backend.services.api;

import be.kdg.kandoe.backend.config.BackendContextConfig;
import be.kdg.kandoe.backend.dom.other.Organisation;
import be.kdg.kandoe.backend.services.exceptions.OrganisationServiceException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;

import javax.transaction.Transactional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = BackendContextConfig.class)
@TransactionConfiguration(defaultRollback = true)
@Transactional
public class OrganisationServiceTest {

    @Autowired
    private OrganisationService organisationService;

    @Test
    public void testFindOrganisationById() throws Exception {
        assertNotNull(organisationService.findOrganisationById(1));
    }

    @Test(expected = OrganisationServiceException.class)
    public void testFindOrganisationByWrongId() throws Exception {
        organisationService.findOrganisationById(-4);
    }

    @Test
    public void testSaveOrganisation() throws Exception {
        organisationService.saveOrganisation(new Organisation("KdG"), 1);
        Organisation org = organisationService.findOrganisationByName("KdG");

        System.out.println(org.getId());
        System.out.println(org.getOrganisationName());
        assertNotNull("The new organisation should have an id", org.getId());
    }
}
