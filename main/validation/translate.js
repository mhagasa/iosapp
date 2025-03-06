/*
 * method to translate nepali number to english number
 */
export const translateNepaliNumber = nepaliNumber =>  {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let englishNumber = '';

    for (let char of nepaliNumber) {
        //check character and update the digit if nepali
        const index = nepaliDigits.indexOf(char);
        if (index !== -1) {
            englishNumber += englishDigits[index];
        } else {
            englishNumber += char;  // In case of non-numeric characters
        }
    }

    return englishNumber;
}