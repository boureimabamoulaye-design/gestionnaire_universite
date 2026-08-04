/**
 * JavaScript Vanilla - Gestion Scolaire Universitaire
 * Interactivité & Fonctions Utilitaires
 */

document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile rétractable
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('appSidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Filtre de recherche dans les tableaux
    const searchInputs = document.querySelectorAll('.table-search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keyup', (e) => {
            const filter = e.target.value.toLowerCase();
            const tableId = e.target.getAttribute('data-table');
            const table = document.getElementById(tableId);

            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(filter) ? '' : 'none';
                });
            }
        });
    });

    // Calcul automatique dans la saisie collective des notes
    const gradeInputs = document.querySelectorAll('.grade-cc-input, .grade-exam-input');
    gradeInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const row = e.target.closest('tr');
            if (row) {
                const ccVal = parseFloat(row.querySelector('.grade-cc-input')?.value || 0);
                const examVal = parseFloat(row.querySelector('.grade-exam-input')?.value || 0);
                
                // Formule Malienne standard : (CC * 0.4) + (Exam * 0.6)
                const finalGrade = (ccVal * 0.4) + (examVal * 0.6);
                const finalCell = row.querySelector('.grade-final-cell');
                const statusCell = row.querySelector('.grade-status-cell');

                if (finalCell) {
                    finalCell.textContent = finalGrade.toFixed(2) + ' / 20';
                }
                if (statusCell) {
                    if (finalGrade >= 10.0) {
                        statusCell.innerHTML = '<span class="badge badge-success">Validé</span>';
                    } else {
                        statusCell.innerHTML = '<span class="badge badge-danger">Ajourné</span>';
                    }
                }
            }
        });
    });
});
