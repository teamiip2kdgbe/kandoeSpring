package be.kdg.kandoe.frontend.DTO;

import be.kdg.kandoe.backend.dom.other.SubTheme;
import org.springframework.hateoas.ResourceSupport;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Jordan on 19/02/2016.
 */
public class ThemeDTO extends ResourceSupport implements Serializable {

    private Integer themeId;

    private String themeName;

    private String description;

    private String iconURL;

    private OrganisationDTO organisation;

    private List<CardDTO> cards;

    private List<SubThemeDTO> subThemes;

    public List<SubThemeDTO> getSubThemes() {
        return subThemes;
    }

    public void setSubThemes(List<SubThemeDTO> subThemes) {
        this.subThemes = subThemes;
    }

    private int countSubthemes;

    public Integer getThemeId() {
        return themeId;
    }

    public void setThemeId(Integer themeId) {
        this.themeId = themeId;
    }

    public String getThemeName() {
        return themeName;
    }

    public void setThemeName(String themeName) {
        this.themeName = themeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconURL() {
        return iconURL;
    }

    public void setIconURL(String iconURL) {
        this.iconURL = iconURL;
    }

    public OrganisationDTO getOrganisation() {
        return organisation;
    }

    public void setOrganisation(OrganisationDTO organisation) {
        this.organisation = organisation;
    }

    public List<CardDTO> getCards() {
        return cards;
    }

    public void setCards(List<CardDTO> cards) {
        this.cards = cards;
    }

    public int getCountSubthemes() {
        return countSubthemes;
    }

    public void setCountSubthemes(int countSubthemes) {
        this.countSubthemes = countSubthemes;
    }
}
