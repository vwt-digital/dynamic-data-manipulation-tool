remote_spec=$(git remote -v | grep "$(git remote)\s.*(push)$")

if [ -n "$(echo ${remote_spec} | grep "vwt-digital")" ]
then
    expected_ref=DAT
    echo "Committing to vwt-digital repository, expect ${expected_ref} issue reference..."
fi

if [ -n "${expected_ref}" ]
then
    grep "${expected_ref}-[0-9]" "$1"

    if [ $? -ne 0 ]
    then
        echo
        echo >&2 "ERROR: Missing required reference to issue, please add ${expected_ref}-nnn to your comment."
        echo >&2 "Your changes were not commited."
        exit 1
    fi
fi
