package eu.cvmatch.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.StringJoiner;

@Setter
@Getter
public class JobPosting {
    // Getters and setters
    private String jobTitle;
    private String industry;
    private String description;
    private List<TechnicalSkill> technicalSkills;

    @Setter
    @Getter
    public static class TechnicalSkill {
        // Getters and setters
        private String skill;
        private int weight;

        @Override
        public String toString() {
            return skill + "(" + weight + "%)";
        }
    }


    /**
     * Normalizes the technical skills scores to sum up to 100%.
     * This method modifies the weights of the technical skills in place.
     */
    public void normalizeTechnicalSkillsScore() {
        if (technicalSkills == null || technicalSkills.isEmpty()) {
            return;
        }
        technicalSkills.stream().sorted()
                .forEach(skill -> {
                    if (skill.getWeight() < 0) {
                        skill.setWeight(0);
                    }
                });
        int totalWeight = technicalSkills.stream().mapToInt(TechnicalSkill::getWeight).sum();
        for (TechnicalSkill skill : technicalSkills) {
            skill.setWeight((int) Math.round((double) skill.getWeight() / totalWeight * 100));
        }

        // check if the sum is 100, if not, normalize again
        totalWeight = technicalSkills.stream().mapToInt(TechnicalSkill::getWeight).sum();
        if (totalWeight == 100) {
            return;
        }
        for (TechnicalSkill skill : technicalSkills) {
            skill.setWeight((int) Math.round((double) skill.getWeight() / totalWeight * 100));
        }


    }

    @Override
    public String toString() {
        StringJoiner sj = new StringJoiner(", ", "JobPosting[", "]");
        sj.add("jobTitle=" + jobTitle);
        sj.add("industry=" + industry);
        sj.add("description=" + (description != null && description.length() > 50
                ? description.substring(0, 47) + "..."
                : description));
        if (technicalSkills != null && !technicalSkills.isEmpty()) {
            sj.add("technicalSkills=" + technicalSkills);
        } else {
            sj.add("technicalSkills=[]");
        }
        return sj.toString();
    }
}
