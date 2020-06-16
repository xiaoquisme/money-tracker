#!/bin/sh

get_all_folders() {
    ls $1
}

pure_log() {
    echo 1>&2 "$1"
}


get_all_files() {
    for f in $(ls $1); do
        if [[ -d $1"/"$f ]]; then
            new_folder=$1"/"$f
            if [[ $f != *"node_modules" ]] && [[ $f != *"cloudfunctions" ]] && [[ $f != *"vanders" ]] ; then
                $(get_all_files $new_folder)
            fi
        elif [[ $f == *".js" ]] && [[ $f != *".test.js" ]] && [[ $f != *"config.js" ]]; then
            file_name=${f%.*}
#            $(pure_log $file_name)
            mv $1/$f  $1/$file_name".ts"
        fi
    done
}
$(get_all_files .)
