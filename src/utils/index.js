export function getSavedTeamMembers() {
  let data = localStorage.getItem("teamMembers");
  if (data) {
    data = JSON.parse(data);
    return data;
  }
  return {};
}

export function saveTeamMembersToLocalStorage(teamMembers) {
  localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
}

export function addTeamMemberToLocalStorage(teamMember) {
  let teamMembers = getSavedTeamMembers();
  teamMembers = {...teamMembers, [teamMember.id]: teamMember};
  saveTeamMembersToLocalStorage(teamMembers);
  return teamMembers;
}

export function removeTeamMemberFromLocalStorage(id) {
  let teamMembers = getSavedTeamMembers();
  if(teamMembers) {
    const teamMember = teamMembers[id];
    if(teamMember) {
      delete teamMembers[id];
      saveTeamMembersToLocalStorage(teamMembers);
    }
  }
  return teamMembers;
}