#!/bin/sh

searches=(
"sw.js"
"
(const VERSION *= *[\'\"])([0-9.]+)([\'\"];)
"

"index.html"
"
(\?giulia=)([0-9.]+)([\'\"])
"

"js/settings.js"
"
(const VERSION *= *[\'\"])([0-9.]+)([\'\"];)
"
)


# temp

# increase version
npm version patch --no-git-tag-version

# save the new version into a variable
replace=`node -p "require('./package.json').version"`

### start loop for the defined searches
for index in "${!searches[@]}"; do
    item=${searches[$index]}

    if [ $((index%2)) -eq 0 ]; then
        # even - filename

        search_file=$item
    else
        # odd - search patterns

        # split the regex by lines
        IFS=$'\n' read -rd '' -a search_patterns <<<"$item"

        for search_pattern in "${search_patterns[@]}"
        do
            sed -i.bk -E -e "s/${search_pattern}/\1$replace\3/g" $search_file
        done

        # because the stupid sed in Mac creates a backup file no matter what
        rm -f $search_file.bk
    fi
done
### end loop
