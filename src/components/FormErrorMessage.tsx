interface FormErrorMessageProps {
    message?: string;
}

const FormErrorMessage = ({
    message,
}: FormErrorMessageProps) => {

    if (!message) {
        return null;
    }

    return (
        <p className="text-sm text-red-600">
            {message}
        </p>
    );
};

export default FormErrorMessage;