package eu.cvmatch.backend.model;

import java.util.List;
import java.util.StringJoiner;

public class JobPosting {
    private String jobTitle;
    private String industry;
    private String description;
    private List<TechnicalSkill> technicalSkills;

    public static class TechnicalSkill {
        private String skill;
        private int weight;

        // Getters and setters
        public String getSkill() { return skill; }
        public void setSkill(String skill) { this.skill = skill; }

        public int getWeight() { return weight; }
        public void setWeight(int weight) { this.weight = weight; }

        @Override
        public String toString() {
            return skill + "(" + weight + "%)";
        }
    }

    // Getters and setters
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<TechnicalSkill> getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(List<TechnicalSkill> technicalSkills) { this.technicalSkills = technicalSkills; }


    /**
     * Normalizes the technical skills scores to sum up to 100%.
     * This method modifies the weights of the technical skills in place.
     */
    public void normalizeTechnicalSkillsScore() {
        if (technicalSkills == null || technicalSkills.isEmpty()) {
            return;
        }
        technicalSkills.forEach(skill -> {
            if (skill.getWeight() < 0) {
                skill.setWeight(0);
            }
        });
        int totalWeight = technicalSkills.stream().mapToInt(TechnicalSkill::getWeight).sum();
        if (totalWeight > 0) {
            for (TechnicalSkill skill : technicalSkills) {
                skill.setWeight((int) Math.round((double) skill.getWeight() / totalWeight * 100));
            }
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


    /**
     * Normalizes the technical skills scores to sum up to 100%.
     * This method modifies the weights of the technical skills in place.
     */
    public void normalizeTechnicalSkillsScore() {
        if (technicalSkills == null || technicalSkills.isEmpty()) {
            return;
        }
        technicalSkills.forEach(skill -> {
            if (skill.getWeight() < 0) {
                skill.setWeight(0);
            }
        });
        int totalWeight = technicalSkills.stream().mapToInt(TechnicalSkill::getWeight).sum();
        if (totalWeight > 0) {
            for (TechnicalSkill skill : technicalSkills) {
                skill.setWeight((int) Math.round((double) skill.getWeight() / totalWeight * 100));
            }
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


    /**
     * Normalizes the technical skills scores to sum up to 100%.
     * This method modifies the weights of the technical skills in place.
     */
    public void normalizeTechnicalSkillsScore() {
        if (technicalSkills == null || technicalSkills.isEmpty()) {
            return;
        }
        technicalSkills.forEach(skill -> {
            if (skill.getWeight() < 0) {
                skill.setWeight(0);
            }
        });
        int totalWeight = technicalSkills.stream().mapToInt(TechnicalSkill::getWeight).sum();
        if (totalWeight > 0) {
            for (TechnicalSkill skill : technicalSkills) {
                skill.setWeight((int) Math.round((double) skill.getWeight() / totalWeight * 100));
            }
        }

        // check if the sum is 100, if not, normalize again
        totalWeight = technicalSkills.stream().mapToInt(TechnicalSkill::getWeight).sum();
        if (totalWeight != 100) {
            int delta = 100 - totalWeight;
            // Adjust the weight of the skill with the largest weight
            TechnicalSkill skillToAdjust = technicalSkills.stream()
                .max((a, b) -> Integer.compare(a.getWeight(), b.getWeight()))
                .orElse(null);
            if (skillToAdjust != null) {
                skillToAdjust.setWeight(skillToAdjust.getWeight() + delta);
            }
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
