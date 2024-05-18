(async () => {
    const startPage = document.getElementById("start-page");
    const startButton = document.getElementById("start-button");
    const helpButton = document.getElementById("help-button");

    const quizPage = document.getElementById("quiz-page");
    const problemTypeParagraph = document.getElementById("problem-type");
    const leftCarbonSpan = document.getElementById("left-carbon");
    const geneticCodeSpan = document.getElementById("genetic-code");
    const rightCarbonSpan = document.getElementById("right-carbon");
    const answerInput = document.getElementById("answer-input");
    const submitButton = document.getElementById("submit-button");
    const endButton = document.getElementById("end-button");

    const helpPage = document.getElementById("help-page");
    const closeHelpButton = document.getElementById("close-help-button");
    const startFromHelpButton = document.getElementById(
        "start-from-help-button"
    );

    const codonAminoAcidData = await fetch("./codon.json").then((response) =>
        response.json()
    );
    const codons = Object.keys(codonAminoAcidData);

    const QUESTION_TYPE = {
        MRNA: 0,
        TRNA: 1,
        TEMPLATE_STRAND: 2, // 주형 DNA
        CODING_STRAND: 3, // 비주형 DNA
    };
    const REPLACE_BASES = {
        TRNA: {
            U: "A",
            C: "G",
            A: "U",
            G: "C",
        },
        TEMPLATE_STRAND: {
            U: "A",
            C: "G",
            A: "T",
            G: "C",
        },
    };

    let correctAnswer;

    function newQuestion() {
        const codon = codons[Math.floor(Math.random() * codons.length)];
        const questionType = Math.floor(Math.random() * 4);
        const reverse = Math.random() < 0.5;

        leftCarbonSpan.textContent = reverse ? "3' \u2014 " : "5' \u2014 ";
        rightCarbonSpan.textContent = reverse ? " \u2014 5'" : " \u2014 3'";

        answerInput.value = "";
        answerInput.focus();

        correctAnswer = codonAminoAcidData[codon];

        switch (questionType) {
            case QUESTION_TYPE.MRNA:
                problemTypeParagraph.textContent = "mRNA";
                geneticCodeSpan.textContent = reverse
                    ? codon.split("").reverse().join("")
                    : codon;
                break;
            case QUESTION_TYPE.TRNA:
                problemTypeParagraph.textContent = "tRNA";
                const reversedAnticodon = codon
                    .split("")
                    .map((base) => REPLACE_BASES.TRNA[base]);
                geneticCodeSpan.textContent = reverse
                    ? reversedAnticodon.join("")
                    : reversedAnticodon.reverse().join("");
                break;
            case QUESTION_TYPE.TEMPLATE_STRAND:
                problemTypeParagraph.textContent = "주형 DNA";
                const reversedTripletCode = codon
                    .split("")
                    .map((base) => REPLACE_BASES.TEMPLATE_STRAND[base]);
                geneticCodeSpan.textContent = reverse
                    ? reversedTripletCode.join("")
                    : reversedTripletCode.reverse().join("");
                break;
            case QUESTION_TYPE.CODING_STRAND:
                problemTypeParagraph.textContent = "비주형 DNA";
                const tripletCode = codon.replaceAll("U", "T");
                geneticCodeSpan.textContent = reverse
                    ? tripletCode.split("").reverse().join("")
                    : tripletCode;
                break;
        }
    }
    function handleAnswerSubmit() {
        if (answerInput.value === correctAnswer) {
            newQuestion();
        } else {
            answerInput.classList.add("wrong");
            setTimeout(() => answerInput.classList.remove("wrong"), 450);
        }
    }

    startButton.addEventListener("click", () => {
        startPage.style.display = "none";
        quizPage.style.display = "block";
        newQuestion();
    });
    helpButton.addEventListener("click", () => {
        startPage.style.display = "none";
        helpPage.style.display = "block";
    });
    endButton.addEventListener("click", () => {
        startPage.style.display = "block";
        quizPage.style.display = "none";
    });
    closeHelpButton.addEventListener("click", () => {
        startPage.style.display = "block";
        helpPage.style.display = "none";
    });
    startFromHelpButton.addEventListener("click", () => {
        quizPage.style.display = "block";
        helpPage.style.display = "none";
        newQuestion();
    });
    submitButton.addEventListener("click", handleAnswerSubmit);
    answerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleAnswerSubmit();
        }
    });
})();
